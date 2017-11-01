<h1 style="text-align:center;">Vue Forms</h1>

[![Packagist Version](https://img.shields.io/packagist/v/epicarrow/vue-forms.svg)](https://packagist.org/packages/epicarrow/vue-forms)
[![Packagist](https://img.shields.io/packagist/dt/epicarrow/vue-forms.svg)](https://packagist.org/packages/epicarrow/vue-forms)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

This package provides a collection of [Vue.js](https://vuejs.org/) form and input components to create pretty and easy ajax requests on a Laravel application.

## Contents
- [Requirements](#requirements)
  - [Server Requirements](#server-requirements)
  - [JS Requirements](#js-requirements)
    - [Mandatory](#mandatory)
    - [Optional](#optional)
  - [Optional Requirements](#optional-requirements)
- [Installation](#installation)  
- [Things to make sure before using this package](#things-to-make-sure-before-using-this-package)
- [Usage](#usage)
  - [Form Components](#form-components)
    - [AjaxForm](#ajaxform)
    - [FormButton](#formbutton)
    - [FormLink](#formlink)
  - [Input Components](#input-components)
    - [FormInput](#forminput)
    - [FormTextarea](#formtextarea)
    - [FormSelect](#formselect)
    - [FormDateInput](#formdateinput)
    - [FormCheckbox](#formcheckbox)
    - [FormSwitch](#formswitch)
    - [FormRadio](#formradio)
    - [HiddenInput](#hiddeninput)
  - [Additional Components](#additional-components)
    - [RemoveButton](#removebutton)
    - [Icon](#icon)
  - [Emitted Events](#emitted-events)
  - [Parsing responses from the server](#parsing-responses-from-the-server)
- [Customizing](#customizing)
  - [Server Response Parsing](#server-response-parsing)
  - [Loading Button](#loading-button)
- [License](#license)

  
## Requirements
### Server Requirements
- [PHP](https://php.net) >= 7.0
- An existing >= [Laravel 5.4](https://laravel.com/docs/master/installation) project

### JS Requirements (see [Installation](#installation))
These are requirements of your Laravel application for the package to work properly on the client side. 
You can install them by just including the according entries in your `package.json` file (see Installation #4).

#### Mandatory
- [Vue](https://vuejs.org/) >= 2.1.10: _To render the Vue components._
- [Vue-I18n](https://github.com/kazupon/vue-i18n) >= 7.3.0: _For internationalization on Vue instances_
- [Lodash](https://lodash.com/) >= 4.17.4: _For using JS helper functions in the scripts which makes the code cleaner_
- [MomentJS](https://momentjs.com/) >= 2.18.1: _For date formatting on JS_
- [JQuery](https://jquery.com/) >= 3.1.1: _For element selection and ajax requests_

#### Optional
- [Bootstrap](https://getbootstrap.com/) >= 3.3.7: _For the design of the input components_
- [Sweetalert](https://sweetalert.js.org/) >= 2.0.4: _To show pretty alert messages on server responses_
- [Tooltip.js](https://popper.js.org/tooltip-examples.html) >= 1.1.5: _To show help texts on the inputs as a pretty tooltip_

### Optional Requirements
To show a loading icon when a form get submitted a [Font Awesome](http://fontawesome.io/icons/) will be shown. This icon can be configured (see Customizing).
If not configured, [Font Awesome](http://fontawesome.io/icons/) need to be installed properly on the application to show the loading icon.

The HTML content of the components is designed for the usage with (Bootstrap 4)(https://getbootstrap.com/). 
To have a nice design of the inputs out of the box, Bootstrap is required.


## Installation

1. To get started, install the package via the Composer package manager: 

    ```bash
    composer require ferdinandfrank/vue-forms
    ```
   
2. In Laravel >= 5.5 this package registers automatically. For previous Laravel versions add the following entry to your providers array in `config/app.php`:
    
    ```php
    'providers' => [
       ...
       ...
       \FerdinandFrank\VueForms\Providers\VueFormsServiceProvider::class
    ]
    ```
    
3. Publish the Vue.js components and other scripts to the `resources/assets/vendor/vue-forms` folder, so you can edit and include the package's files within you application's scripts:

    ```bash
    php artisan vue-forms:init
    ```
    
4. Add the following entries to the `dependencies` array in your `package.json` file. These are required.

    ```json
    "dependencies": {
        "bootstrap-sass": "^3.3.7",
        "lodash": "^4.17.4",
        "jquery": "^3.1.1",
        "moment": "^2.18.1",
        "popper.js": "^1.12.5",
        "sweetalert": "^2.0.4",
        "tooltip.js": "^1.1.5",
        "vue": "^2.1.10",
        "vue-i18n": "^7.3.0"
      }
    
     ```    
    
5. Include the main JS within your application's script, e.g., from `resources/assets/js/app.js` copy the following statement:

      ```javascript
      require('../vendor/vue-forms/js/vue-forms');
      ```    
      
6. Include the main SCSS within your application's script, e.g., from `resources/assets/sass/app.scss` copy the following statement:

    ```scss
    @import "../vendor/vue-forms/scss/vue-forms";
    ```  
    
7. Compile your scripts via webpack or any other compiler.    
    
That's it! You can now use the Vue.js components of this package.


## Things to make sure before using this package:
- Include a Laravel CSRF token in a meta tag on every view where you want to use the form components.
This package tries to find the token within the meta tag and includes it in every request to the server.

    ```php
    <meta name="csrf-token" content="{{ csrf_token() }}">
    ```
    
## Usage

### Form Components
These components are used to submit data to the server via an ajax request.

**Shared Properties that all of these components inherit:**

- **action**: The url where to submit the form.
    - type: String
    - required: true

- **method**: The method to use for the submit.
    - type: String
    - required: true
 
- **data**: The predefined data to submit with the form.
    - type: Object
    - default: {}
 
- **confirm**: States if a confirm message shall be shown, before the form will be submitted.
    - type: Boolean
    - default: false
 
- **confirmType**: The type of the confirm alert to ask the user, if he really wants to submit the form.
Will only be used if the 'confirm' property is set to true.
    - type: String
    - default: 'warning'
 
- **confirmProps**: The props to insert into the confirm message, if one shall be shown.
Will only be used if the 'confirm' property is set to true.
    - type: Object
    - default: null
 
- **alertError**: States if an error alert message shall be shown, if an error occurred.
    - type: Boolean
    - default: true
 
- **alertDuration**: The duration of the alert that will be shown after the form has been submitted.
Will only be used if the duration is not defined by the server response.
    - type: Number
    - default: 3000
 
- **langKey**: The lang key to use to identify the messages to show to the user on a confirm alert.
              Will be inserted in a full key existing of the method and further props to retrieve the i18n messages.
              For the message to show on a confirm alert before a 'POST' request the following key will be used:
              'confirm.[langKey].post.message'
    - type: String
    - default: 'default'
 
- **eventName**: The base name of the events that get triggered by the form during a submit.
    - type: String
    - default: 'ajaxForm'
 
- **appendResponse**: The selector of the wrapper, where to append the response's data to.
    - type: String
    - default: null
 
- **prependResponse**: The selector of the wrapper, where to prepend the response's data to.
    - type: String
    - default: null
  
- **replaceResponse**: The selector of the element, to replace with the response's data.
    - type: String
    - default: null
    
- **remove**: The selector of the element to remove after the form was submitted and a successful response from the server was received.
    - type: String
 
- **ajax**: States if the form shall be submitted with ajax. Even though this is the purpose of this package, it is sometimes useful to use the functionality of this package without submitting the form via ajax.
    - type: Boolean
    - default: true

#### AjaxForm
Represents a basic form element that gets submitted via ajax if a submit is triggered.

##### Minimal Usage
```html
<ajax-form method="[METHOD]" action="[ACTION]">
    // Include input components
    
    <button type="submit">Submit</button>
</ajax-form>
```

This component will render to the following HTML:
```html
<form action="[ACTION]" method="[METHOD]">
    // ...
    
    <button type="submit">Submit</button>
</form>
```

##### Properties:
This component inherits all of the shared properties listed above.

- **clear**: States if the form's inputs shall be cleared after the submit.
    - type: Boolean
    - default: false

- **reset**: States if the form's inputs shall be reset after the submit.
    - type: Boolean
    - default: false
    
#### FormButton
Represents a button in the style of [Bootstrap](https://getbootstrap.com/) that submits an ajax request as soon as the button gets clicked.
As this component is often used as a 'delete button' the props default to this functionality.

##### Minimal Usage
```html
<form-button action="[ACTION]">
    // Include button content here
</form-button>
```

This component will render to the following HTML:
```html
<button type="button" class="btn">
    // ...
</button>
```

##### Properties:
This component inherits all of the shared properties listed above.  

- **color**: The color class of the button.
    - type: String
    - default: 'danger'

- **size**: The size class of the button.
    - type: String

- **method**: The method to use for the submit. Overrides the mixin's prop.
    - type: String
    - default: 'delete'
    
#### FormLink
Represents a link that submits an ajax request as soon as the link gets clicked.

##### Minimal Usage
```html
<form-link action="[ACTION]" method="[METHOD]">
    // Include link content here
</form-link>
```

This component will render to the following HTML:
```html
<a href="[ACTION]">
    // ...
</a>
```

##### Properties:
This component inherits all of the shared properties listed above.   


### Input Components
These components are used to represent inputs.

**Shared Properties that all of these components inherit:**

- **name**: The name of the input. Will also be the key of the value when the form gets submitted.
    - type: String
    - required: true

- **value**: The predefined value of the input.
    - type: String|Number
    - default: ''
    
- **labelText**: The text to show above the input as a label. If not specified, the component will try to find a label based on the input's name and specified 'langKey' prop.
    - type: String
    - default: null

- **langKey**: The language key of the label.
               Will be inserted in a full key.
               For the label to show on an input with the name 'email' the following key will be used:
               'input[.langKey].email'
    - type: String
    - default: ''

- **disabled**: States if the input shall be disabled.
    - type: Boolean
    - default: false

- **showLabel**: States if a label shall be displayed above the input.
    - type: Boolean,
    - default: true

- **check**: Function to check if the input is valid. If it is invalid an error message,
             based upon the property 'name' and 'langKey' will be shown to the user.
             The function receives the current value of the input as first parameter
             and a callback function as the second. This callback must return true,
             if the input is valid and false otherwise.
    - type: Function

- **required**: States if a value on the input is required
    - type: Boolean,
    - default: false

- **help**: The help text to show as a tooltip when hovering over the input's help icon.
    - type: String
    - default: null

- **helpPosition**:  The position of the tooltip when the 'help' prop is set.
    - type: String
    - default: 'top'

- **color**: The specific color of the input group.
    - type: String
    - default: null

- **size**: The specific size of the input group.
    - type: String
    - default: null

- **ignoreErrors**: States if errors on the input shall be ignored, i.e., shall not be displayed
    - type: Boolean
    - default: false
    
#### FormInput
Represents an input field in the style of [Bootstrap](https://getbootstrap.com/).

##### Minimal Usage
```html
<form-input name="[NAME]"></form-input>
```

This component will render to the following HTML:
```html
<div class="form-group">
    <label for="[NAME]-input">
        <span>[LABEL] *</span>
    </label>
    <div class="input-group">
        <input id="[NAME]-input" type="text" name="[NAME]" placeholder="" class="form-control">
    </div>
</div>
```

##### Properties:
This component inherits all of the shared properties listed above.  

- **type**: The type of the input field.
    - type: String
    - default: 'text'
    
- **step**: The step to increase the value if the input's type is set to "number".
    - type: String
    - default: ''  
    
- **min**: The minimum length of the input value.
    - type: Number
    - default: null

- **max**: The maximum length of the input value.
    - type: Number
    - default: null

- **confirmed**: If true, the input is treated as a confirmation input and needs to have a corresponding input with the same value.
                 Ex.: If the name of this input is 'foo_confirmation', the input with the name 'foo' must have the same value.
    - type: Boolean
    - default: false

- **placeholder**: The placeholder to show on the input.
    - type: String
    - default: null

- **icon**: The icon to show next to the input field.
    - type: String
    - default: null

- **addonSubmit**: States, if a form submit button shall be appended on the input.
                   Additionally a reset button will be appended if the form was already submitted.
    - type: Boolean
    - default: false

- **addonSubmitContent**: The text to show in the appended submit button, see 'addonSubmit'
    - type: String
    - default: 'Go!'

- **addonSubmitColor**: The color of the appended submit button, see 'addonSubmit'
    - type: String
    - default: null

- **addonResetColor**: The color of the appended reset button, see 'addonSubmit'
    - type: String
    - default: null    

#### FormTextarea
Represents a textarea field in the style of [Bootstrap](https://getbootstrap.com/).

##### Minimal Usage
```html
<form-textarea name="[NAME]"></form-textarea>
```

This component will render to the following HTML:
```html
<div class="form-group">
    <label for="[NAME]-input">
        <span>[LABEL]</span>
    </label>
    <div class="input-group">
        <textarea id="[NAME]-input" name="[NAME]" rows="3" placeholder="" aria-label="" class="form-control"></textarea>
    </div>
</div>
```

##### Properties:
This component inherits all of the shared properties listed above.  

- **min**: The minimum length of the input value.
    - type: Number
    - default: null

- **max**: The maximum length of the input value.
    - type: Number
    - default: null

- **confirmed**: If true, the input is treated as a confirmation input and needs to have a corresponding input with the same value.
                 Ex.: If the name of this input is 'foo_confirmation', the input with the name 'foo' must have the same value.
    - type: Boolean
    - default: false

- **placeholder**: The placeholder to show on the input.
    - type: String
    - default: null

- **icon**: The icon to show next to the input field.
    - type: String
    - default: null

- **addonSubmit**: States, if a form submit button shall be appended on the input.
                   Additionally a reset button will be appended if the form was already submitted.
    - type: Boolean
    - default: false

- **addonSubmitContent**: The text to show in the appended submit button, see 'addonSubmit'
    - type: String
    - default: 'Go!'

- **addonSubmitColor**: The color of the appended submit button, see 'addonSubmit'
    - type: String
    - default: null

- **addonResetColor**: The color of the appended reset button, see 'addonSubmit'
    - type: String
    - default: null    
    
#### FormSelect
Represents a select input field in the style of [Bootstrap](https://getbootstrap.com/).

##### Minimal Usage
```html
<form-select name="[NAME]">
    // options (can also be set as options prop to have dynamic options)
</form-select>
```

This component will render to the following HTML:
```html
<div class="form-group">
    <label for="[NAME]-input">
        <span>[LABEL]</span>
    </label>
    <div class="input-group">
        <select id="[NAME]-input" name="[NAME]" class="form-control">
            // rendered options
        </select>
    </div>
</div>
```

##### Properties:
This component inherits all of the shared properties listed above.  

- **options**: An array with objects containing a key 'value' with the option value and a key 'text' with the option text to show. These will be used as dropdown choices.
    - type: Array
    - default: []
    
- **min**: The minimum length of the input value.
    - type: Number
    - default: null

- **max**: The maximum length of the input value.
    - type: Number
    - default: null

- **confirmed**: If true, the input is treated as a confirmation input and needs to have a corresponding input with the same value.
                 Ex.: If the name of this input is 'foo_confirmation', the input with the name 'foo' must have the same value.
    - type: Boolean
    - default: false

- **placeholder**: The placeholder to show on the input.
    - type: String
    - default: null

- **icon**: The icon to show next to the input field.
    - type: String
    - default: null

- **addonSubmit**: States, if a form submit button shall be appended on the input.
                   Additionally a reset button will be appended if the form was already submitted.
    - type: Boolean
    - default: false

- **addonSubmitContent**: The text to show in the appended submit button, see 'addonSubmit'
    - type: String
    - default: 'Go!'

- **addonSubmitColor**: The color of the appended submit button, see 'addonSubmit'
    - type: String
    - default: null

- **addonResetColor**: The color of the appended reset button, see 'addonSubmit'
    - type: String
    - default: null        
    
#### FormDateInput
Represents a date input field in the style of [Bootstrap](https://getbootstrap.com/) and [Eonasdan's Datepicker](https://eonasdan.github.io/bootstrap-datetimepicker/).

##### Minimal Usage
```html
<form-date-input name="[NAME]"></form-date-input>
```

This component will render to the following HTML:
```html
<div class="form-group">
    <label for="[NAME]-input">
        <span>[LABEL]</span>
    </label>
    <div class="input-group">
        <input id="[NAME]-input" type="text" name="[NAME]" placeholder="" class="form-control datetimepicker">
    </div>
</div>
```

##### Properties:
This component inherits all of the shared properties listed above.  

- **format**: The format to use on the date picker. If a time is specified, the picker will automatically show a time picker as well, e.g., for the format 'YYYY-MM-DD HH:mm:ss'
    - type: String
    - default: "YYYY-MM-DD"
    
- **min**: The minimum length of the input value.
    - type: Number
    - default: null

- **max**: The maximum length of the input value.
    - type: Number
    - default: null

- **confirmed**: If true, the input is treated as a confirmation input and needs to have a corresponding input with the same value.
                 Ex.: If the name of this input is 'foo_confirmation', the input with the name 'foo' must have the same value.
    - type: Boolean
    - default: false

- **placeholder**: The placeholder to show on the input.
    - type: String
    - default: null

- **icon**: The icon to show next to the input field.
    - type: String
    - default: null

- **addonSubmit**: States, if a form submit button shall be appended on the input.
                   Additionally a reset button will be appended if the form was already submitted.
    - type: Boolean
    - default: false

- **addonSubmitContent**: The text to show in the appended submit button, see 'addonSubmit'
    - type: String
    - default: 'Go!'

- **addonSubmitColor**: The color of the appended submit button, see 'addonSubmit'
    - type: String
    - default: null

- **addonResetColor**: The color of the appended reset button, see 'addonSubmit'
    - type: String
    - default: null       

#### FormCheckbox
Represents a checkbox in the style of [Bootstrap](https://getbootstrap.com/).

##### Minimal Usage
```html
<form-checkbox name="[NAME]"></form-checkbox>
```

This component will render to the following HTML:
```html
<div class="form-group">
    <div class="control-group">
        <label class="control checkbox">
            <input id="[NAME]-input" name="[NAME]" type="checkbox" class="control-input">
            <span id="[NAME]-checkbox-indicator" class="control-indicator"></span>
            <span class="control-description">[LABEL]</span>
        </label>
    </div>
</div>
```

##### Properties:
This component inherits all of the shared properties listed above.  

- **value**: The predefined value of the checkbox.  Overrides the mixin's prop.
    - type: Boolean|Number
    - default: false
 
#### FormSwitch
Represents a checkbox in the style of an iOS switch.

##### Minimal Usage
```html
<form-switch name="[NAME]"></form-switch>
```

This component will render to the following HTML:
```html
<div class="form-group">
    <div class="control-group">
        <div id="switch-[NAME]" class="switch off">
            <div class="on-background background-fill"></div>
            <div class="state-background background-fill"></div>
            <div class="handle"></div>
            <input id="[NAME]-input" type="checkbox" name="[NAME]" class="control-input" style="display: none;">
        </div>
        <label>
            <span class="control-description">[LABEL]</span>
        </label>
    </div>
</div>
```

##### Properties:
This component inherits all of the shared properties listed above.  

- **value**: The predefined value of the checkbox.  Overrides the mixin's prop.
    - type: Boolean|Number
    - default: false

#### FormRadio
Represents a radio input field in the style of [Bootstrap](https://getbootstrap.com/).

##### Minimal Usage
```html
<form-radio name="[NAME]" :options="{[VALUE1]: '[LABEL1]', [VALUE2]: '[LABEL2]'}">
    // further radio option (can also be set as options prop to have dynamic radio options
</form-radio>
```

This component will render to the following HTML:
```html
<div class="form-group">
    <div class="form-check">
        <label class="form-check-label">
            <input type="radio" class="form-check-input" value="[VALUE1]">
            [LABEL1]
        </label>
    </div>
    <div class="form-check">
        <label class="form-check-label">
        <input type="radio" class="form-check-input" value="[VALUE2]">
            [LABEL2]
        </label>
    </div>
</div>
```

##### Properties:
This component inherits all of the shared properties listed above.  

- **options**: An object with keys as the value and values as the labels to be used as radio choices.
    - type: Object
    - default: {}
    

#### HiddenInput
Represents a hidden input field.

##### Minimal Usage
```html
<hidden-input name="[NAME]"></hidden-input>
```

This component will render to the following HTML:
```html
<input id="[NAME]-input" type="hidden" name="[NAME]">
```

##### Properties:
This component inherits all of the shared properties listed above.  
    
### Additional Components    

#### RemoveButton
Represents a button in the style of [Bootstrap](https://getbootstrap.com/) that removes a specified element after it was clicked without submitting a form..

##### Minimal Usage
```html
<remove-button remove="[SELECTOR]">
    // Include button content here
</remove-button>
```

This component will render to the following HTML:
```html
<button type="button" class="btn">
    // ...
</button>
```

##### Properties: 

- **remove**: The selector of the element to remove after the form was submitted and a successful response from the server was received.
    - type: String
    
- **color**: The color class of the button.
    - type: String
    - default: 'danger'

- **size**: The size class of the button.
    - type: String 

#### Icon
Represents an icon element.

##### Minimal Usage
```html
<icon icon="[ICON]"></icon>
```

This component will render to the following HTML:
```html
<i class="[ICON]"></i>
```

##### Properties: 

- **icon**: The icon class.
    - type: String
    - required: true

    
### Emitted Events
Each form component will emit specific events during the submit process. To be able to listen to those events from non parent components these events will be emitted on a predefined Vue component called `window.eventHub`.
Each event name will end with a dynamic name. This name can be configured by setting the `eventName` prop on form components.
- **prevented_submit-[eventName]**: Will be emitted when a submit of the form was requested but the form is not valid, i.e., one or more inputs within the form are still invalid.
How to listen to this event from other Vue instances:
 
    ```js
    // - formComponent: The current instance of the form component (useful to extract the form with 'component.$el')
    window.eventHub.$on('prevented_submit-[eventName]', function(formComponent) {
      // handle the event
    });
    ```    
- **submitting-[eventName]**: Will be emitted right before the data will be sent to the server.
How to listen to this event from other Vue instances:
 
    ```js
    // - formComponent: The current instance of the form component (useful to extract the form with 'component.$el')
    window.eventHub.$on('submitting-[eventName]', function(formComponent) {
      // handle the event
    });
    ```  
    
- **response-[eventName]**: Will be emitted when the response from the server was received.
How to listen to this event from other Vue instances:
 
    ```js
    // - success: {@code true} if the request was successful handled on the server, {@code false} otherwise.
    // - response: The response message retrieved from the server.
    // - method: The method that was used on the request.
    // - formComponent: The current instance of the form component (useful to extract the form with 'component.$el')
    window.eventHub.$on('response-[eventName]', function(success, response, method, formComponent) {
      // handle the event
    });
    ```      
    
Each input component will emit specific events. To be able to listen to those events from non parent components these events will be emitted on a predefined Vue component called `window.eventHub`.
Each event name will begin with value of the input's `name` prop.

- **[inputName]-input-changed**: Will be emitted as soon as the input's value changes.
How to listen to this event from other Vue instances:
 
    ```js
    // - value: the new value of the input
    // - oldValue: the previous value of the input
    window.eventHub.$on('[inputName]-input-changed', function(value, oldValue) {
      // handle the event
    });
    ```    

### Parsing responses from the server
Each response from the server based on an ajax request from the form components should provide the following data:
- alert: _If this key is included, the form response handlers will try to show an alert message based on the following provided data:_
    - title: _The title to show on the alert._
    - message: _The message to show as the main content on the alert._ 
    - accept: _The text of the confirm button to show on the alert. If not provided, the alert will automatically disappear after the specified duration._
    - duration: _The duration after which the alert will automatically disappear, if not 'accept' prop is provided. Defaults to 3 seconds._
- redirect: _If this key is included, the form response handlers will redirect the user to the url specified as the value of this key after a potential alert message was shown._
- reload: _If this key is included, the form response handlers will reload the page after a potential alert message was shown._
- data: _Further response data. Can be HTML content to append, prepend, or replace existing content on the page (see the shared props of the form components)._
- error: _The error message to show if an error occurred during the request._

_Note: The name of the keys can be customized by editing the `serverKeys` data on the file `resources/assets/js/mixins/AjaxFormMixin.js`._

### Customizing

#### Server Response Parsing
The form response handlers will look for specific keys on the response from the server to define the further actions (see 'Parsing responses from the server'). The keys can be customized by editing the `serverKeys` data on the file `resources/assets/js/mixins/AjaxFormMixin.js`.

#### Loading Button
After the user clicks the submit button of a form component, a loading icon will automatically be inserted within the submit button. The content of the button can be customized by editing the `loadingContent` data on the file `resources/assets/js/mixins/AjaxFormMixin.js`.

## Credits
- The date component `FormDateInput` is based on [the Bootstrap datetimepicker by eonasdan](https://eonasdan.github.io/bootstrap-datetimepicker/).
- The alerts are handled by the [Sweetalert](https://sweetalert.js.org/) plugin
- The tooltips are handled by the [Tooltip.js](https://popper.js.org/tooltip-examples.html) plugin

## License
[MIT](https://github.com/ferdinandfrank/vue-forms/blob/master/LICENSE)
