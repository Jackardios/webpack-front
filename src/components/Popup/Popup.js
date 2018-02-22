function classNameToSelector( className ) {
    const classArray = className.split(' '),
          selector = '.' + classArray.join('.');
    return selector;
}

/**
 * Popup form options 
 * 
 * @typedef {Object} PopupFormOptions
 * 
 * @property {string} formClass - Form class
 * @property {string} submitText - Form submit button text
 * @property {string} submitClass - Form submit button class
 * @callback onSubmitHandler - Form submit handler
 */ 
const defaultFormOptions = {
    formClass: 'overlay-form',
    submitText: 'Отправить',
    submitClass: 'overlay-form__input btn btn--primary btn--medium',
    onSubmitHandler: null,
};

/**
 * Popup form input options 
 * 
 * @typedef {Object} PopupFormInputOptions
 * 
 * @property {string} type - Input type
 * @property {string} placeholder - Input placeholder
 * @property {string} class - Input class
 * @property {string} name - Input name
 * @property {string} value - Input value
 * @property {boolean} required - Input is required?
 */ 
const defaultFormInputOptions = {
    type: 'text',
    placeholder: '',
    class: 'input input--text input--fullwidth',
    name: '',
    value: '',
    required: false,
};

class Popup {
    constructor( options ) {
        this.defaultOptions = {
            popupsContainerSelector: 'body',
            popupCloseBtnClass: 'popup__close-btn btn',
            popupTitleClass: 'popup__title',
            popupContentClass: 'popup__content',
            overlayCloseBtnClass: 'overlay-close-btn',
            overlayTitleClass: 'overlay__title',
            overlayContentClass: 'overlay-content',
            activeClass: 'active',
        };

        this.options = new Object;
        $.extend( this.options, this.defaultOptions, options);
    }
    
    /**
     * Initialize the popup controller
     */
    init() {
        this.popupsContainer = $(this.options.popupsContainerSelector);
        this.popupElements = new Object;
        this._bindCommonHandlers();
    }
    
    _bindCommonHandlers() {
        const popupObj = this;
        const popupCloseBtnSelector = classNameToSelector(this.options.popupCloseBtnClass),
              overlayCloseBtnSelector =  classNameToSelector(this.options.overlayCloseBtnClass),
              closeBtnSelector = popupCloseBtnSelector + ',' + overlayCloseBtnSelector;
        this.popupsContainer.on("click", closeBtnSelector, function() {
            let popupId = $(this).closest(".overlay")[0].id;
            popupObj.hide( popupId );
        });

        const $body = $("body");
        $body.on("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", ".overlay", function() {
            const $this = $(this);

            if ( $this.hasClass("hiding") ) {
                $this
                    .removeClass( "hiding" )
                    .removeClass( popupObj.options.activeClass );
            }
        });
    }
    
    /**
     * Get popup element
     * 
     * @param {string} popupId Popup identifier
     */
    get( popupId ) {
        return this.popupElements[popupId];
    }
    
    /**
     * Show popup element
     * 
     * @param {string} popupId Popup identifier
     */
    show( popupId ) {
        const popupElement = (popupId) ? this.popupElements[popupId] : this;
        if ( popupElement ) {
            popupElement.addClass( this.options.activeClass );
        }
    }
    
    /**
     * Hide popup element
     * 
     * @param {string} popupId Popup identifier
     */
    hide( popupId ) {
        const popupElement = (popupId) ? this.popupElements[popupId] : this;
        if ( popupElement ) {
            popupElement.addClass( "hiding" );
        }
    }
    
    /**
     * Create popup element
     * 
     * @param {Object} options Popup options
     * @param {string} options.popupId Popup identifier
     * @param {string} options.popupSize Popup size
     * @param {string} options.title Popup title 
     * @param {string} options.content Popup content
     * @return {jQuery} - popup form element
     */
    create( options ) {
        const popupHTML = this._renderPopup( options ),
              popupElem = $(popupHTML);
        
        this.popupsContainer.append(popupElem);
        return this.popupElements[options.popupId] = popupElem;
    }
    
    /**
     * Change popup element if it exists
     * 
     * @param {Object} options Popup options
     * @param {string} options.popupId Popup identifier
     * @param {string} options.popupSize Popup size
     * @param {string} options.title Popup title 
     * @param {string} options.content Popup content
     * @return {jQuery} - popup form element
     */
    change( options ) {
        const popupElement = (options.popupId) ? this.popupElements[options.popupId] : this;
        if ( popupElement ) {
            if ( !this.popupsCache ) {
                this.popupsCache = new Object;
            }

            let cache = this.popupsCache[options.popupId];

            if ( !cache )  {
                cache = this.popupsCache[options.popupId] = {
                    title: $( classNameToSelector(this.options.popupTitleClass), popupElement ),
                    content: $( classNameToSelector(this.options.popupContentClass), popupElement )
                };
            }

            cache['title'].html( options.title );
            cache['content'].html( options.content );
        }

        return popupElement;
    }
    
    /**
     * Create popup element or change an existing one
     * 
     * @param {Object} options Popup options
     * @param {string} options.popupId Popup identifier
     * @param {string} options.popupSize Popup size
     * @param {string} options.title Popup title 
     * @param {string} options.content Popup content
     * @return {jQuery} - popup form element
     */
    createOrChange( options ) {
        const popupElement = this.change( options );
        if ( !popupElement ) {
            return this.create( options );
        }
    }

    /**
     * Create popup form element
     * 
     * @param {Object} options Popup form options
     * @param {string} options.popupId Popup identifier
     * @param {string} options.title Popup title 
     * @param {string} options.logo Popup logo URL
     * @param {PopupFormInputOptions[]} options.inputs Popup input options
     * @param {PopupFormOptions} options.formOptions Popup form options
     * @return {jQuery} - popup form element
     */
    createForm( options ) {
        options.formOptions = $.extend({}, defaultFormOptions, options.formOptions);
        const popupHTML = this._renderPopupForm( options ),
              popupElem = $(popupHTML);
        
        this.popupsContainer.append(popupElem);
        if (options.popupId && options.formOptions['formClass']) {
            const formSelector = `#${options.popupId} ${classNameToSelector(options.formOptions['formClass'])}`;
            this._bindPopupFormSubmitHandler(formSelector, options.formOptions['onSubmitHandler']);
        }
        return this.popupElements[options.popupId] = popupElem;
    }

    /**
     * Normalize serialized array data
     * 
     * @param {Object[]} serializedArray Serialized array data
     * @return {Object} - normalized data
     */
    _normalizeSerializedArray(serializedArray) {
        let normalizedData = new Object;
        $.each(serializedArray, (idx, obj) => {
            normalizedData[obj.name] = obj.value;
        });
        return normalizedData;
    }

    /**
     * Bind submit handler for popup form
     * 
     * @param {string} formSelector Form selector
     * @callback onSubmitHandler Form submit handler
     * @return {boolean} - boolean status (true - success, false - fail)
     */
    _bindPopupFormSubmitHandler( formSelector, onSubmitHandler ) {
        if (formSelector && (typeof onSubmitHandler === "function")) {
            $(formSelector).on("submit", (event) => {
                const data = this._normalizeSerializedArray($(event.target).serializeArray());
                onSubmitHandler(data);
                return false;
            });
            return true;
        }
        return false;
    }

    /**
     * Render popup form HTML
     * 
     * @param {Object} options Popup rendering options
     * @param {string} options.popupId Popup identifier
     * @param {string} options.popupSize Popup size
     * @param {string} options.title Popup title 
     * @param {string} options.content Popup content
     * @return {string} - rendered popup form HTML
     */
    _renderPopup( options ) {
        const popupSizeClass = (options.popupSize === 'large') ? 'popup--large' : 'popup--small';
        return `<div class="overlay overlay--center" id="${options.popupId}">
                    <div class="overlay__popup-container">
                        <div class="popup ${popupSizeClass}">
                            <div class="popup__header">
                                <div class="${this.options.popupTitleClass}">${options.title}</div>
                                <button class="${this.options.popupCloseBtnClass}"><i class="fa fa-times" aria-hidden="true"></i></button>
                            </div>
                            <div class="${this.options.popupContentClass}">${options.content}</div>
                        </div>
                    </div>
                </div>`;
    }

    /**
     * Render full overlay form HTML
     * 
     * @param {Object} options Popup rendering options
     * @param {string} options.popupId Popup identifier
     * @param {string} options.logo Popup logo URL
     * @param {string} options.title Popup title 
     * @param {string} options.content Popup content
     * @return {string} - rendered popup form HTML
     */
    _renderFullOverlayPopup( options ) {
        return `<div class="overlay" id="${options.popupId}">
                    <div class="overlay__container">
                        <div class="wrapper">
                            <div class="overlay-header grid-container grid-container--x-between grid-container--y-center">
                                <a href="/" title="Главная" class="grid-column">
                                    <img src="${options.logo}" alt="logo" class="overlay-header__logo">
                                </a>
                                <div class="grid-column">
                                    <div class="overlay-close-btn overlay-close-btn--dark btn">
                                        <div class="overlay-close-btn__box">
                                            <span class="overlay-close-btn__line"></span>
                                            <span class="overlay-close-btn__line"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="wrapper wrapper--small">
                            <div class="overlay__title">${options.title}</div>
                            ${options.content}
                        </div>
                    </div>
                </div>`;
    }

    /**
     * Generate unique id
     * 
     * @return {string} - generated unique id
     */
    _generateUID() {
        return '_' + Math.random().toString(12).substr(2, 6);
    }

    /**
     * Render popup form inputs HTML
     * 
     * @param {PopupFormInputOptions[]} inputs Popup input options
     * @return {string} - rendered popup form inputs HTML
     */
    _renderInputs( inputs ) {
        let inputsHTML = '', inputOptions, inputName, inputId, typeNumberStep;
        $.each(inputs, (inputName, inputOptions) => {
            inputOptions = $.extend({}, defaultFormInputOptions, inputOptions);
            inputName = inputOptions['name'] || inputName;
            inputId = inputName + this._generateUID();
            typeNumberStep = (inputOptions['type'] === "number")? ' step="0.01"' : '';
            inputsHTML +=  `<div class="overlay-form__input ${inputOptions['class']}">
                                <input type="${inputOptions['type']}"${typeNumberStep} name="${inputName}" value="${inputOptions['value']}" id="${inputId}" ${inputOptions['required']? 'required' : ''}>
                                <label for="${inputId}" class="input__label">${inputOptions['placeholder'] || inputName}<span class="accent">${inputOptions['required']? '*' : ''}</span></label>
                                <div class="input__error"></div>
                            </div>`;
        });
        return inputsHTML;
    }

    /**
     * Render popup form HTML
     * 
     * @param {Object} options Popup form rendering options
     * @param {string} options.popupId Popup identifier
     * @param {string} options.title Popup title 
     * @param {string} options.description Popup description
     * @param {string} options.logo Popup logo URL
     * @param {PopupFormInputOptions[]} options.inputs Popup input options
     * @param {PopupFormOptions} options.formOptions Popup form options
     * @return {string} - rendered popup form HTML
     */
    _renderPopupForm( options ) {
        const formHTML = `<form class="overlay-content ${options.formOptions['formClass']}">
                                ${this._renderInputs(options.inputs)}
                                <div class="overlay-form__btn-container text-align-center">
                                    <button type="submit" class="${options.formOptions['submitClass']}">${options.formOptions['submitText']}</button>
                                </div>
                          </form>`;
        return this._renderFullOverlayPopup({
            popupId: options.popupId,
            title: options.title,
            logo: options.logo,
            content: formHTML,
        });
    }

    /**
     * Render errors list HTML
     * 
     * @param {string[]} errors Errors list as array
     */
    renderErrorsList( errorsArray ) {
        return `<ul class="errors-list">
                    <li class="errors-list__item">
                        ${ errorsArray.join('</li><li class="errors-list__item">') }
                    </li>
                </ul>`;
    } 

}

export default Popup;