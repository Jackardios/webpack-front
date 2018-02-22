function addEventListenerList(list, event, fn) {
    for (let i = 0, len = list.length; i < len; i++) {
        list[i].addEventListener(event, fn, true);
    }
}

class TextField {
    
    constructor( selector ) {
        const elements = document.querySelectorAll(selector);
        this._selector = selector;
        this._inputObjects = this._createInputObjects( elements );
        this._bindHandlers( elements );
    }

    _createInputObjects( elements ) {
        const inputObjects = {};
        let id = 0;

        Array.from(elements).forEach((element) => {
            const inputObjectId = id++;
            inputObjects[inputObjectId] = {
                id: inputObjectId,
                wrapper: element,
                input: element.querySelector('input'),
                label: element.querySelector('.input__label'),
                errorContainer: element.querySelector('.input__error'),
                regex: new RegExp(element.dataset.pattern),
                errorMessage: element.dataset.errorMessage
            };
            element.dataset.id = inputObjectId;
            element.dataset.textField = 'true';
        });

        return inputObjects;
    }

    _bindHandlers( elements ) {

        document.addEventListener('focus', (event) => {
            const inputWrapper = event.target.parentElement;
            
            if (inputWrapper.hasAttribute('data-text-field')) {
                inputWrapper.classList.add('active');
            }
        }, true);

        document.addEventListener('blur', (event) => {
            const inputObjectId = event.target.parentElement.dataset.id;

            if (inputObjectId) {
                const inputObject = this._inputObjects[inputObjectId];
                if ( inputObject ) {
                    if ( inputObject.input.value === '' ) {
                        inputObject.wrapper.classList.remove('active');
                        inputObject.wrapper.classList.remove('invalid');
                        inputObject.wrapper.classList.remove('valid');

                        if (inputObject.errorContainer) {
                            inputObject.errorContainer.innerHTML = '';
                        }
                    } else {
                        inputObject.wrapper.classList.add('active');
                        this.validate( inputObjectId );
                    }
                }
            }
        }, true);

    }

    validate( inputObjectId ) {
        const inputObject = this._inputObjects[inputObjectId];

        if ( inputObject.regex.test(inputObject.input.value) ) {
            inputObject.wrapper.classList.add('valid');
            inputObject.wrapper.classList.remove('invalid');
            inputObject.errorContainer.innerHTML = '';
        } else {
            inputObject.wrapper.classList.remove('valid');
            inputObject.wrapper.classList.add('invalid');
            inputObject.errorContainer.innerHTML = inputObject.errorMessage;
        }
    }
}

export default TextField;