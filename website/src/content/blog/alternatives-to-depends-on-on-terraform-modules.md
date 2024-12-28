---
title: "Alternatives to depends_on on Terraform Modules"
date: "2024-12-27T23:19:58+00:00"
---

Recently I was working on a project that used ECS Fargate for deploying services
exposed behind an ALB. The infrastructure was provisioned using Terraform. Since
the service is multitenant with a separate infrastructure for each tenant, I needed
to organize the code so that it's easy to spin up the infrastructure for new tenants
and make changes for the existing ones.

Since I'm doing this as a contract job, I know that eventually someone else will
continue the work, so I did my best to keep things clean and leave as few footguns
as possible.

To achieve said goals, I needed to extract pieces of infrastructure into reusable
modules. I ended up with a module hierarchy consisting of several levels, where
with each level, modules get more specific to the application and cover wider area
of the infrastructure.

At the lowest level are generic modules, that are used to provision the basic building
blocks, such as VPCs, S3 buckets and ECS services. On the highest level there is
a module that provisions the entire infrastructure for a tenant with a couple of
variables for configuration.

Since most services consisted of an ECS service, exposed behind a shared load
balancer with an RDS database behind it, I created a module that would provision
all of these components, building on top of shared modules such as ECS service
and RDS modules.

However I kept getting an error when registering a load balancer target group to
an ECS service, due to no rules being associated with it. This was clearly due to
terraform not creating the rule before trying to register the target group, as
there is no explicit dependency between the ECS service and the rule.

My first instinct was to specify this dependency by adding `depends_on` meta argument
to the ECS module, and it worked. Looking something like this:

```hcl
module "ecs_service" {
  source = "../ecs-fargate/service"

  ...

  load_balancer = {
    app = {
      target_group_arn = aws_lb_target_group.this.arn
      ...
    }
  }

  depends_on = [
    aws_lb_listener_rule.this
  ]
}

resource "aws_lb_target_group" "this" {
  ...
}

resource "aws_lb_listener_rule" "this" {
  ...
}
```

After a few days, when I made a change to a rule, terraform produced a strange diff,
replacing a bunch of resources inside the ECS module that didn't need to be replaced.
Among the resources were a bunch of policies that relied on `data.aws_iam_policy_document`
and were needed for the ECS tasks to run, causing it to break during initialization.

I first tried upgrading terraform and the AWS provider to the latest versions, but
the issue persisted. After taking a deeper look I realized that the issue only occurs
for the service where I changed the load balancer rule. That's when I realized that
the issue is likely caused by the `depends_on`. Indeed, this was the case, and terraform [documentation](https://developer.hashicorp.com/terraform/language/meta-arguments/depends_on#processing-and-planning-consequences)
advises against doing this:

> You should use `depends_on` as a last resort because it can cause Terraform to create
> more conservative plans that replace more resources than necessary. For example,
> Terraform may treat more values as unknown “(known after apply)” because it is
> uncertain what changes will occur on the upstream object. This is especially
> likely when you use `depends_on` for modules.

Initially it seemed like I was in a lose-lose situation, since both keeping as
well as removing the `depends_on` from the ECS module causes issues.

Fortunately, it turns out there are at least four solutions to the problem, all with
different tradeoffs. I ended up choosing the one that didn't have any immediate
downsides and was the easiest for me to implement, but depending on the situation
a different solution might make more sense.

The first solution that came to mind was to add a superfluous variable that would
establish a dependency between the rule and the ECS service, but I really didn't
like having this as a part of the module's public interface.

I could also move the target group and the rule inside the ECS module, where
they would be created if certain variables are provided. But I also didn't like
having this as part of the foundational ECS service module.

Another solution would be to group the alb rule and the target group together in
a module, with target group's ARN as the output with [`depends_on` set on it](https://developer.hashicorp.com/terraform/language/values/outputs#depends_on-explicit-output-dependencies).
While this seems like a solution with no apparent downsides, it adds an unnecessary
level of indirection, and forces me to either go through a nontrivial amount of
work to create a proper module for this that can be reused in other places, or
shove it into an internal module, only built for the purpose of fixing the dependency
issue.

Finally, I could establish a transitive dependency between the module and the rule
by adding a `depends_on` meta argument to another resource the module was directly
dependent on, along with a comment explaining the reason. This is what I ended up
going with, since it required the least modifications, and it was extremely unlikely
that the dependency between the resource I chose and the module is going to be broken,
breaking the transitive dependency.

The solution looked something like this:

```hcl
module "ecs_service" {
  source = "../ecs-fargate/service"

  ...

  network_configuration = {
    security_groups  = [aws_security_group.app.id]
    ...
  }

  load_balancer = {
    app = {
      target_group_arn = aws_lb_target_group.this.arn
      ...
    }
  }
}

resource "aws_security_group" "app" {
  ...

  # NOTE: the sg doesn't depend on the alb listener rule, however ...
  depends_on = [
    aws_lb_listener_rule.this,
  ]
}

resource "aws_lb_target_group" "this" {
  ...
}

resource "aws_lb_listener_rule" "this" {
  ...
}
```
