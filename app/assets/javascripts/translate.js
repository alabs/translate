// require 'prototype'

    var source_ids = [];

    function googleCallback(response) {
        if (response.error) {
            alert(response.error.message);
            return;
        }
        var result_text = response.data.translations[0].translatedText.gsub(/__(.+)__/, function(match) {
          return '{{' + match[1] + '}}';
        });
        var id = source_ids.shift();
        if (id) {
            Form.Element.setValue(id, result_text);
        }
    }

    function getGoogleTranslation(id, text, from_language, to_language) {
        source_ids.push(id);
        text = text.replace(/\{\{/, '__').replace(/\}\}/, '__');
        var s = document.createElement('script'), api_key = '<%= Translate.api_key %>';
        s.type = 'text/javascript';
        s.src = 'https://www.googleapis.com/language/translate/v2?key=' + api_key + '&source=' +
            from_language + '&target=' + to_language + '&callback=googleCallback&q=' + text;
        document.getElementsByTagName("head")[0].appendChild(s);
    }

    function bingCallback(text) {
        var id = source_ids.shift();
        if (text && id) {
            var result_text = text.gsub(/__(.+)__/, function(match) {
              return '{{' + match[1] + '}}';
            });
            Form.Element.setValue(id, result_text);
        }
    }

    function getBingTranslation(id, text, from_language, to_language) {
        source_ids.push(id);
        text = text.replace(/\{\{/, '__').replace(/\}\}/, '__');
        var s = document.createElement("script"), app_id = '<%= Translate.app_id %>';
        s.type = 'text/javascript';
        s.src = 'http://api.microsofttranslator.com/V2/Ajax.svc/Translate?oncomplete=bingCallback&appId=' +
            app_id + '&from=' + from_language + '&to=' + to_language + '&text=' + text;
        document.getElementsByTagName("head")[0].appendChild(s);
    }

    /*
    prototypeUtils.js from http://jehiah.com/
    Licensed under Creative Commons.
    version 1.0 December 20 2005

    Contains:
    + Form.Element.setValue()
    + unpackToForm()

    */

    /* Form.Element.setValue("fieldname/id","valueToSet") */
    Form.Element.setValue = function(element,newValue) {
        element_id = element;
        element = $(element);
        if (!element){element = document.getElementsByName(element_id)[0];}
        if (!element){return false;}
        var method = element.tagName.toLowerCase();
        var parameter = Form.Element.SetSerializers[method](element,newValue);
    }

    Form.Element.SetSerializers = {
      input: function(element,newValue) {
        switch (element.type.toLowerCase()) {
          case 'submit':
          case 'hidden':
          case 'password':
          case 'text':
            return Form.Element.SetSerializers.textarea(element,newValue);
          case 'checkbox':
          case 'radio':
            return Form.Element.SetSerializers.inputSelector(element,newValue);
        }
        return false;
      },

      inputSelector: function(element,newValue) {
        fields = document.getElementsByName(element.name);
        for (var i=0;i<fields.length;i++){
          if (fields[i].value == newValue){
            fields[i].checked = true;
          }
        }
      },

      textarea: function(element,newValue) {
        element.value = newValue;
      },

      select: function(element,newValue) {
        var value = '', opt, index = element.selectedIndex;
        for (var i=0;i< element.options.length;i++){
          if (element.options[i].value == newValue){
            element.selectedIndex = i;
            return true;
          }        
        }
      }
    }

    function unpackToForm(data){
       for (i in data){
         Form.Element.setValue(i,data[i].toString());
       }
    }


	onload = function (){
		$$("div.translation input, div.translation textarea").each(function (e){
			Event.observe(e,'focus', function (elm){
				this.up(1).down(".translation-text").addClassName("focus-text");
				this.up(1).addClassName("selected");
			});
			Event.observe(e,'blur', function (elm,e){
				this.up(1).down(".translation-text").removeClassName("focus-text");
				this.up(1).removeClassName("selected");
			});
		});
	}
