export default () => {
    $(() => {
        const globalLoading = $("#global-loading");
        const fields = new Object;
        const callrequestPopup = window.popupObj.createForm({
            popupId: 'callrequest-popup',
            title: 'Оставьте ваши данные, и мы свяжемся с вами в ближайшее время!',
            logo: window.wordpress.h_logo,
            inputs: [
                {
                    name: 'user_name',
                    placeholder: 'Ваше имя',
                    required: true,
                },
                {
                    name: 'user_phone',
                    type: 'tel',
                    placeholder: 'Ваш номер телефона',
                    required: true,
                },
                {
                    name: 'user_message',
                    type: 'text',
                    placeholder: 'Ваше сообщение',
                    required: false,
                },
            ],
            formOptions: {
                submitText: 'Заказать звонок',
                onSubmitHandler: (data) => {
                    console.dir( fields );
                    $.ajax({
                        url: window.wordpress.ajaxUrl,
                        type: 'POST',
                        dataType: 'JSON',
                        data: {
                            action: 'send_callrequest',
                            ...fields,
                            ...data
                        },
                        beforeSend(data) {
                            globalLoading.fadeIn(320); 
                        },
                        complete(data) {
                            globalLoading.fadeOut(320); 
                        },
                        success(data) {
                            const title = (data.status === 'error') ? 'Ошибка' : 'Успешно';
                            window.popupObj.createOrChange({
                                popupId: 'alert-popup',
                                title: title,
                                content: window.popupObj.renderErrorsList([data.message || data.statusText]),
                            });
                            
                            window.popupObj.show('alert-popup');
                        },
                        error(data) {
                            window.popupObj.createOrChange({
                                popupId: 'alert-popup',
                                title: 'Ошибка',
                                content: window.popupObj.renderErrorsList([data.message || data.statusText]),
                            });
                            
                            window.popupObj.show('alert-popup');
                        },
                    })
                    window.popupObj.hide('callrequest-popup');
                },
            },
        });

        $("body").on("click", ".callrequest-btn", function() {
            window.popupObj.show('callrequest-popup');
            fields['product_id'] = $(this).data('productId');
            fields['product_code'] = $(this).data('productCode');
            fields['product_side'] = $(this).data('productSide');
            
            return false;
        });
    });
};
