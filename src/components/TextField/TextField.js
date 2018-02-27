class TextField {
    
    constructor( selector ) {
        const elements = $(selector);
        this._elements = elements;
        this._selector = selector;
        this._inputObjects = this._createInputObjects( elements );
        this._bindHandlers( elements );
    }

    _createInputObjects( elements ) {
        const inputObjects = {};
        let id = 0;

        elements.each(function() {
            const inputObjectId = id++,
                  $this = $(this);
            inputObjects[inputObjectId] = {
                id: inputObjectId,
                wrapper: $this,
                input: $this.find('input'),
                label: $this.find('.input__label'),
                errorContainer: $this.find('.input__error'),
                regex: new RegExp($this.data('pattern')),
                errorMessage: $this.data('errorMessage')
            };

            $this.attr('data-id', inputObjectId);
            $this.attr('data-text-field', 'true');
        });

        return inputObjects;
    }

    _bindHandlers( elements ) {
        const self = this;

        this._elements.on('focus', 'input', function(event) {
            const inputWrapper = $(this.parentElement);
            
            if (inputWrapper.attr('data-text-field')) {
                inputWrapper.addClass('active');
            }

        });

        this._elements.on('blur', 'input', function(event) {
            const inputObjectId = $(this.parentElement).data("id");

            if (inputObjectId) {
                const inputObject = self._inputObjects[inputObjectId];
                if ( inputObject ) {
                    if ( inputObject.input.val() === '' ) {
                        inputObject.wrapper.removeClass('active');
                        inputObject.wrapper.removeClass('invalid');
                        inputObject.wrapper.removeClass('valid');

                        if (inputObject.errorContainer) {
                            inputObject.errorContainer.innerHTML = '';
                        }
                    } else {
                        inputObject.wrapper.addClass('active');
                        self.validate( inputObjectId );
                    }
                }
            }
        });

    }

    validate( inputObjectId ) {
        const inputObject = this._inputObjects[inputObjectId];

        if ( inputObject.regex.test(inputObject.input.val()) ) {
            inputObject.wrapper.addClass('valid');
            inputObject.wrapper.removeClass('invalid');
            if (inputObject.errorContainer) {
                inputObject.errorContainer.innerHTML = '';
            }
        } else {
            inputObject.wrapper.removeClass('valid');
            inputObject.wrapper.addClass('invalid');
            if (inputObject.errorContainer) {
                inputObject.errorContainer.innerHTML = inputObject.errorMessage;
            }
        }
    }
}

export default TextField;