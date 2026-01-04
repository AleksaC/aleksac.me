.PHONY: _default
_default:
	@make -C ./website

%:
	@make -C ./website $@
