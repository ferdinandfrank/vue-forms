[![GitHub package version](https://img.shields.io/github/package-json/v/badges/shields.svg)](https://github.com/ferdinandfrank/vue-forms)
[![Packagist](https://img.shields.io/packagist/dt/ferdinandfrank/vue-forms.svg)](https://packagist.org/packages/ferdinandfrank/vue-forms)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

This package provides a collection of [Vue.js](https://vuejs.org/) form and input components to create pretty and easy ajax requests on a Laravel application.

# 1. Requirements
## Server Requirements
- [PHP](https://php.net) >= 7.0
- An existing >= [Laravel 5.4](https://laravel.com/docs/master/installation) project

## JS Requirements
There are a few requirements of your Laravel application for the package to work properly on the client side. 
You can install them by just including the according entries in your `package.json` file (see [Installation](#installation) #4).

### Mandatory
- [Vue.js](https://vuejs.org/) >= 2.1.10: _To render the Vue.js components._
- [Lodash](https://lodash.com/) >= 4.17.4: _For using JS helper functions in the scripts which makes the code cleaner_
- [MomentJS](https://momentjs.com/) >= 2.18.1: _For date formatting on JS_
- [JQuery](https://jquery.com/) >= 3.1.1: _For element selection and ajax requests_

### Optional
- [Bootstrap](https://getbootstrap.com/) >= 3.3.7: _For the design of the input components_
- [Sweetalert](https://sweetalert.js.org/) >= 2.0.4: _To show pretty alert / confirm messages_
- [Tooltip.js](https://popper.js.org/tooltip-examples.html) >= 1.1.5: _To show help texts on the inputs as a pretty tooltip_

## Optional Requirements
To show a loading icon when a form gets submitted as well as to show a help icon next to the inputs, [Font Awesome](http://fontawesome.io/icons/) will be used.
[Font Awesome](http://fontawesome.io/icons/) need to be installed properly on the application to show these icons. Otherwise the components need to be configured.

The HTML content of the components is designed for the usage with [Bootstrap 4](https://getbootstrap.com/). 
To have a nice design of the inputs out of the box, Bootstrap is required.


# 2. Installation

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
    
4. Add the following entries to the `dependencies` array in your `package.json` file, if these do not yet exist. The first four are required, the last four (sweetalert, bootstrap-sass, popper.js, tooltip.js) optional (see [Optional Requirements](#optional)).

    ```json
    "dependencies": {
        "vue": "^2.1.10",
        "lodash": "^4.17.4",
        "jquery": "^3.1.1",
        "moment": "^2.18.1",
        "sweetalert": "^2.0.4",
        "bootstrap-sass": "^3.3.7",
        "popper.js": "^1.12.5",
        "tooltip.js": "^1.1.5"
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

# 3. Examples
This package is build to create easy readable forms and submitting them via ajax using the power of Vue.js components.
The following examples shall demonstrate common use cases:

**HTML form with two input components which get cleared after the submit. Additionally a success alert message will be shown after the server successfully processed the request.**
         
In your HTML / Blade file:

```html
<ajax-form method="[METHOD]" action="[ACTION]" :clear="true">
    <form-input name="name" label="Name" :value="MyName"></form-input>
    <form-select name="gender" label="Gender" :value="m">
        <option value="m">Male</option>
        <option value="f">Female</option>
    </form-select>
    
    <button type="submit">Submit</button>
</ajax-form>
```
  
In your controller method:

```php
public function handleRequest(Request $request) {
    // Handle the request
    
    return response()->json([
        'alert' => [
            'title'   => 'Success',
            'message' => 'Request was successful!',
            'accept'  => 'Alright!'
        ]
    ]);
}
```

[See more examples regarding the server response here](#server-response-handling)

***

**HTML form with one input component that validates against specific rules.**
         
In your HTML / Blade file:

```html
<ajax-form method="[METHOD]" action="[ACTION]">
    <form-input name="email" label="E-Mail" :rules="[{email: true, message: 'Please enter a valid email address.'}, {min: 5, message: 'Please enter at least 5 characters.'}]"></form-input>
    
    <button type="submit">Submit</button>
</ajax-form>
```
    
# 4. Documentation

## Things to make sure before using this package
Include a Laravel CSRF token in a meta tag on every view where you want to use the form components.
This package tries to find the token within the meta tag and includes it in every request to the server.
By doing this, you don't need to add a CSRF input field to your forms.

```php
<meta name="csrf-token" content="[CSRF_TOKEN]">
```

## Components
The following form and input components can be used to make ajax requests to the server.

### Form Components
These components are used to submit data to the server via an ajax request.

**Shared Properties that all of these components inherit:**

- **action:** The url where to submit the form.
    - type: String
    - required: true

- **method:** The method to use for the submit.
    - type: String
    - required: true
 
- **data:** The predefined data to submit with the form.
    - type: Object
    - default: {}
 
- **confirm:** An object to define the messages to show to the user within a confirm alert, before the form will be submitted.
                If not defined, no confirm message will be shown.
    - type: Object
    - default: null
    
    The object can contain the following key-value-pairs to modify the confirm alert:
    - **title:** _[The title of the confirm message]_
    - **message:** _[The body message of the confirm message]_
    - **accept:** _[The button text to show on the 'accept' button]_
    - **cancel:** _[The button text to show on the 'cancel' button]_
    - **type:** _[The alert type of the confirm dialog]_
        -  'info'
        - 'success'
        - 'error'
        - 'warning' [DEFAULT]
 
- **alertError:** States if an error alert message shall be shown, if an error occurred.
    - type: Boolean
    - default: true
 
- **alertDuration:** The duration of the alert that will be shown after the form has been submitted.
Will only be used if the duration is not defined by the server response.
    - type: Number
    - default: 3000
 
- **eventName:** The base name of the events that get triggered by the form during a submit.
    - type: String
    - default: 'ajaxForm'
 
- **appendResponse:** The selector of the wrapper, where to append the response's data to.
    - type: String
    - default: null
 
- **prependResponse:** The selector of the wrapper, where to prepend the response's data to.
    - type: String
    - default: null
  
- **replaceResponse:** The selector of the element, to replace with the response's data.
    - type: String
    - default: null
    
- **remove:** The selector of the element to remove after the form was submitted and a successful response from the server was received.
    - type: String
 
- **ajax:** States if the form shall be submitted with ajax. Even though this is the purpose of this package, it is sometimes useful to use the functionality of this package without submitting the form via ajax.
    - type: Boolean
    - default: true

### AjaxForm
Represents a basic form element that gets submitted via ajax if a submit is triggered.

#### Minimal Usage
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

#### Properties:
This component inherits all of the shared properties listed above as well as the following:

- **clear:** States if the form's inputs shall be cleared after the submit.
    - type: Boolean
    - default: false

- **reset:** States if the form's inputs shall be reset after the submit.
    - type: Boolean
    - default: false
    
### FormButton
Represents a button in the style of [Bootstrap](https://getbootstrap.com/) that submits an ajax request as soon as the button gets clicked.
As this component is often used as a 'delete button' the props default to this functionality.

#### Minimal Usage
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

#### Properties:
This component inherits all of the shared properties listed above as well as the following:  

- **color:** The color class of the button.
    - type: String
    - default: 'danger'

- **size:** The size class of the button.
    - type: String

- **method:** The method to use for the submit. Overrides the mixin's prop.
    - type: String
    - default: 'delete'
    
### FormLink
Represents a link that submits an ajax request as soon as the link gets clicked.

#### Minimal Usage
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

#### Properties:
This component inherits all of the shared properties listed above as well as the following:   


## Input Components
These components are used to represent inputs.

**Shared Properties that all of these components inherit:**

- **name:** The name of the input. Will also be the key of the value when the form gets submitted.
    - type: String
    - required: true

- **value:** The predefined value of the input.
    - type: String,Number,Boolean
    - default: ''
    
- **rules:** Array of rule objects to validate the input's value. See section [Validation](#validation) for further docs.
    - type: Array
    - default: []   
    
- **label:** The text to show above the input as a label. If not specified, no label will be shown.
    - type: String
    - default: null

- **disabled:** States if the input shall be disabled.
    - type: Boolean
    - default: false

- **help:** The help text to show as a tooltip when hovering over the input's help icon.
    - type: String
    - default: null

- **color:** The specific color of the input group.
    - type: String
    - default: null

- **size:** The specific size of the input group.
    - type: String
    - default: null
    
### FormInput
Represents an input field in the style of [Bootstrap](https://getbootstrap.com/). For uploading files please use the [FormFileInput component](#formfileinput).

#### Minimal Usage
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

#### Properties:
This component inherits all of the shared properties listed above as well as the following:  

- **type:** The type of the input field.
    - type: String
    - default: 'text'
    
- **step:** The step to increase the value if the input's type is set to "number".
    - type: String
    - default: ''  
    

- **placeholder:** The placeholder to show on the input.
    - type: String
    - default: null

- **icon:** The icon to show next to the input field.
    - type: String
    - default: null

- **addonSubmit:** States, if a form submit button shall be appended on the input.
                   Additionally a reset button will be appended if the form was already submitted.
    - type: Boolean
    - default: false

- **addonSubmitContent:** The text to show in the appended submit button, see 'addonSubmit'
    - type: String
    - default: 'Go!'

- **addonSubmitColor:** The color of the appended submit button, see 'addonSubmit'
    - type: String
    - default: null

- **addonResetColor:** The color of the appended reset button, see 'addonSubmit'
    - type: String
    - default: null    

### FormTextarea
Represents a textarea field in the style of [Bootstrap](https://getbootstrap.com/).

#### Minimal Usage
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

#### Properties:
This component inherits all of the shared properties listed above as well as the following:  

- **rows:** The textarea's native 'rows' attribute to define the height of the textarea.
    - type: Number
    - default: 3

- **placeholder:** The placeholder to show on the input.
    - type: String
    - default: null

- **icon:** The icon to show next to the input field.
    - type: String
    - default: null

- **addonSubmit:** States, if a form submit button shall be appended on the input.
                   Additionally a reset button will be appended if the form was already submitted.
    - type: Boolean
    - default: false

- **addonSubmitContent:** The text to show in the appended submit button, see 'addonSubmit'
    - type: String
    - default: 'Go!'

- **addonSubmitColor:** The color of the appended submit button, see 'addonSubmit'
    - type: String
    - default: null

- **addonResetColor:** The color of the appended reset button, see 'addonSubmit'
    - type: String
    - default: null    
    
### FormSelect
Represents a select input field in the style of [Bootstrap](https://getbootstrap.com/).

#### Minimal Usage
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

#### Properties:
This component inherits all of the shared properties listed above as well as the following:  

- **value:** The predefined value of the input.
    - type: String,Number,Array
    - default: ''

- **multiple:** States if multiple values can be selected on the input.
    - type: Boolean
    - default: false

- **options:** An array with objects containing a key 'value' with the option value and a key 'text' with the option text to show. These will be used as dropdown choices.
    - type: Array
    - default: []

- **placeholder:** The placeholder to show on the input.
    - type: String
    - default: null

- **icon:** The icon to show next to the input field.
    - type: String
    - default: null

- **addonSubmit:** States, if a form submit button shall be appended on the input.
                   Additionally a reset button will be appended if the form was already submitted.
    - type: Boolean
    - default: false

- **addonSubmitContent:** The text to show in the appended submit button, see 'addonSubmit'
    - type: String
    - default: 'Go!'

- **addonSubmitColor:** The color of the appended submit button, see 'addonSubmit'
    - type: String
    - default: null

- **addonResetColor:** The color of the appended reset button, see 'addonSubmit'
    - type: String
    - default: null        
    
### FormDateInput
Represents a date input field in the style of [Bootstrap](https://getbootstrap.com/) and [Eonasdan's Datepicker](https://eonasdan.github.io/bootstrap-datetimepicker/).

#### Minimal Usage
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

#### Properties:
This component inherits all of the shared properties listed above as well as the following:  

- **format:** The format to use on the date picker. If a time is specified, the picker will automatically show a time picker as well, e.g., for the format 'YYYY-MM-DD HH:mm:ss'
    - type: String
    - default: "YYYY-MM-DD"

- **placeholder:** The placeholder to show on the input.
    - type: String
    - default: null

- **icon:** The icon to show next to the input field.
    - type: String
    - default: null

- **addonSubmit:** States, if a form submit button shall be appended on the input.
                   Additionally a reset button will be appended if the form was already submitted.
    - type: Boolean
    - default: false

- **addonSubmitContent:** The text to show in the appended submit button, see 'addonSubmit'
    - type: String
    - default: 'Go!'

- **addonSubmitColor:** The color of the appended submit button, see 'addonSubmit'
    - type: String
    - default: null

- **addonResetColor:** The color of the appended reset button, see 'addonSubmit'
    - type: String
    - default: null       
    
### FormFileInput
Represents a file input field.
**Important Note:** Files will be uploaded in a `base64` format.

#### Minimal Usage
```html
<form-file-input name="[NAME]"></form-file-input>
```

This component will render to the following HTML:
```html
<div class="form-group">
    <label for="[NAME]-input">
        <span>[LABEL]</span>
    </label>
    <div class="input-group">
        <input type="text" name="[NAME]" style="display: none">
        <input id="[NAME]-input" type="file" name="[NAME]-selector" placeholder="" class="form-control">
    </div>
</div>
```

#### Properties:
This component inherits all of the shared properties listed above as well as the following:  

- **placeholder:** The placeholder to show on the input.
    - type: String
    - default: null

- **icon:** The icon to show next to the input field.
    - type: String
    - default: null

- **addonSubmit:** States, if a form submit button shall be appended on the input.
                   Additionally a reset button will be appended if the form was already submitted.
    - type: Boolean
    - default: false

- **addonSubmitContent:** The text to show in the appended submit button, see 'addonSubmit'
    - type: String
    - default: 'Go!'

- **addonSubmitColor:** The color of the appended submit button, see 'addonSubmit'
    - type: String
    - default: null

- **addonResetColor:** The color of the appended reset button, see 'addonSubmit'
    - type: String
    - default: null     

### FormCheckbox
Represents a checkbox in the style of [Bootstrap](https://getbootstrap.com/).

#### Minimal Usage
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

#### Properties:
This component inherits all of the shared properties listed above as well as the following:  

- **value:** The predefined value of the input. Overrides the mixin's prop.
    - type: Boolean,Number,String
    - default: 0
    
- **checkedValue:** The value to submit when the checkbox is checked, otherwise `0` will be submitted.
    - type: Boolean,Number,String
    - default: 1
 
### FormSwitch
Represents a checkbox in the style of an iOS switch.

#### Minimal Usage
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

#### Properties:
This component inherits all of the shared properties listed above as well as the following:  

- **value:** The predefined value of the input. Overrides the mixin's prop.
    - type: Boolean,Number,String
    - default: 0
    
- **checkedValue:** The value to submit when the checkbox is checked, otherwise `0` will be submitted.
    - type: Boolean,Number,String
    - default: 1

### FormRadio
Represents a radio input field in the style of [Bootstrap](https://getbootstrap.com/).

#### Minimal Usage
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

#### Properties:
This component inherits all of the shared properties listed above as well as the following:  

- **options:** An object with keys as the value and values as the labels to be used as radio choices.
    - type: Object
    - default: {}
    

### HiddenInput
Represents a hidden input field.

#### Minimal Usage
```html
<hidden-input name="[NAME]"></hidden-input>
```

This component will render to the following HTML:
```html
<input id="[NAME]-input" type="hidden" name="[NAME]">
```

#### Properties:
This component inherits all of the shared properties listed above as well as the following:  
    
## Additional Components    

### RemoveButton
Represents a button in the style of [Bootstrap](https://getbootstrap.com/) that removes a specified element after it was clicked without submitting a form..

#### Minimal Usage
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

#### Properties: 

- **remove:** The selector of the element to remove after the form was submitted and a successful response from the server was received.
    - type: String
    
- **color:** The color class of the button.
    - type: String
    - default: 'danger'

- **size:** The size class of the button.
    - type: String 

### Icon
Represents an icon element.

#### Minimal Usage
```html
<icon icon="[ICON]"></icon>
```

This component will render to the following HTML:
```html
<i class="[ICON]"></i>
```

#### Properties: 

- **icon:** The icon class.
    - type: String
    - required: true

    
## Emitted Events
Each form component will emit specific events during the submit process. To be able to listen to those events from non parent components these events will be emitted on a predefined Vue component called `window.eventHub`.
Each event name will end with a dynamic name. This name can be configured by setting the `eventName` prop on form components.
- **prevented_submit-[eventName]:** Will be emitted when a submit of the form was requested but the form is not valid, i.e., one or more inputs within the form are still invalid.
How to listen to this event from other Vue instances:
 
    ```js
    // - formComponent: The current instance of the form component (useful to extract the form with 'component.$el')
    window.eventHub.$on('prevented_submit-[eventName]', function(formComponent) {
      // handle the event
    });
    ```    
- **submitting-[eventName]:** Will be emitted right before the data will be sent to the server.
How to listen to this event from other Vue instances:
 
    ```js
    // - formComponent: The current instance of the form component (useful to extract the form with 'component.$el')
    window.eventHub.$on('submitting-[eventName]', function(formComponent) {
      // handle the event
    });
    ```  
    
- **response-[eventName]:** Will be emitted when the response from the server was received.
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

- **[inputName]-input-changed:** Will be emitted as soon as the input's value changes.
How to listen to this event from other Vue instances:
 
    ```js
    // - value: the new value of the input
    // - oldValue: the previous value of the input
    window.eventHub.$on('[inputName]-input-changed', function(value, oldValue) {
      // handle the event
    });
    ```    
    
- **[inputName]-input-validated:** Will be emitted as soon as the input's validation status changes.
How to listen to this event from other Vue instances:
 
    ```js
    // - isValid: States if the value of the input is valid against the specified input rules
    window.eventHub.$on('[inputName]-input-validated', function(isValid) {
      // handle the event
    });
    ```  

## Server Response Handling
By default, an ajax form component will show an alert with an error message whenever the server responses with an error status code. This can be disabled by setting the 'alertError' prop to 'false'.
Additionally, the form component will automatically fetch the error message from the server response for Laravel >= 5.5 validation errors as well as for thrown Laravel HTTP Exceptions.
To fully customize the shown alert for a server error or even to show an alert on success responses, see the following:

By specifying specific keys on the server response, the handling by the form components after the form submit can be controlled. Therefor, just return a JSON response with one or multiple of the following keys:
- **alert:** _If this key is included, the form response handlers will try to show an alert message based on the following provided data:_
    - title: _The title to show on the alert._
    - message: _The message to show as the main content on the alert._ 
    - accept: _The text of the confirm button to show on the alert. If not provided, the alert will automatically disappear after the specified duration._
    - duration: _The duration after which the alert will automatically disappear, if not 'accept' prop is provided. Defaults to 3 seconds._
    - type: _The type of the alert to show. Can be one of the following: 'success', 'error', 'info'. Defaults to 'success' on successful server responses and to 'error' on server error responses._
- **redirect:** _If this key is included, the form response handlers will redirect the user to the url specified as the value of this key after a potential alert message was shown._
- **reload:** _If this key is included, the form response handlers will reload the page after a potential alert message was shown._
- **data:** _Further response data. Can be HTML content to append, prepend, or replace existing content on the page (see the shared props of the form components)._
- **error:** _A simple error message to show if an error occurred during the request._


### Examples
#### Successful Response With Success Alert
To show a success alert after the form was processed by the server, just return the following JSON response in your corresponding controller method:
```php
public function handleRequest(Request $request) {
   // Handle the request

   return response()->json([
       'alert' => [
           'title'   => 'Success',
           'message' => 'Request was successful!',
           'accept'  => 'Alright!'
       ]
   ]);
}
``` 

#### Successful Response With Success Alert Followed By A Redirect
To show a success alert after the form was processed by the server and to redirect the user right after the alert disappeared (4s), just return the following JSON response in your corresponding controller method:
```php
public function handleRequest(Request $request) {
   // Handle the request

   return response()->json([
       'redirect' => route('home'),
       'alert' => [
           'title'   => 'Success',
           'message' => 'Request was successful!',
           'duration'  => 4000
       ]
   ]);
}
``` 

#### Error Response With Error Alert
To show an error alert after the form was processed by the server, just return the following JSON response in your corresponding controller method:
```php
public function handleRequest(Request $request) {
   // Handle the request

   return response()->json([
       'alert' => [
           'title'   => 'Error',
           'message' => 'An error occurred!',
           'accept'  => 'Alright!'
       ]
   ], 500);
}
``` 

#### Error Response With Simple Error Message
To show a simple error message after the form was processed by the server, just return the following JSON response in your corresponding controller method:
```php
public function handleRequest(Request $request) {
   // Handle the request

   return response()->json([
       'error' => 'An error occurred!',
   ], 500);
}
```

_Note: The name of the keys can be customized by editing the `serverKeys` data on the file `resources/assets/js/mixins/AjaxFormMixin.js`._


## Validation
Each input component accepts a prop named `rules`. By defining this prop on your Vue instances you can validate the input's value.
Therefore, the prop accepts an array of rule object which should have one of the following value-key-pairs to define a validation rule:
- **min:** [Number: min length of input's value] (_The value must be at least X characters._)
- **max:** [Number: max length of inputs value] (_The value may not be greater than X characters._)
- **required:** true (_A value is required._)
- **confirmed:** [String: name of the input field that should contain the same value as this input field] (_The input's value must be the same as the value on an other input field._)
- **email:** true (_The input must be a valid email address._)
- **url:** true (_The input must be a valid url._)
- **accepted:** true (_The input must have one of the following values: 'on', 'true', 1, true_)
- **after:** [String: name of the input field that contains the date value that should be before the input's date value] (_The input's date value must be after the date value on an other input field._)
- **before:** [String: name of the input field that contains the date value that should be after the input's date value] (_The input's date value must be before the date value on an other input field._)
- **same:** [String: name of the input field that contains the date value that should be the same as the input's date value] (_The input's date value must be the same as the date value on an other input field._)
- **custom:** [Function: Custom validation function which accepts the params _name, value, callback_. The callback should return an object of the structure 
    _{valid: [VALID], message: [DEFAULT_ERROR]}_] (_The input must be a valid against this validation function._)

Additionally a rule object can have a 'message' key with a corresponding error message as the value,
which will be shown when the given rule check fails.

By default, every time the value of the input component changes, the value will be validated against the defined rules
after a default timeout of 100ms. This prevents an input to not validate on every consecutive change. 
This default behavior can be changed for all inputs by modifying the `VUE_FORMS_VALIDATION_TIMEOUT` value in the published `resources/assets/js/config.js` file.
Additionally this timeout value can be defined for each individual input by specifying a value for the key `timeout` on the input's rule object.

**Note:** If any of a form component's child input components is invalid due to the defined validation rules, the parent form can not be submitted.

### Examples
We want to define that a value on the input is required and should contain at least 5 characters:

```html
<form-input name="name" :rules="[{required: true, message: 'Please enter a value.'}, {min: 5, message: 'Please enter at least 5 characters.'}]"></form-input>
```

We want to define that a value on the input needs to be a valid email address. But we only want to validate this if the user didn't change the input for 1 second.

```html
<form-input name="name" :rules="[{email: true, timeout: 1000}]"></form-input>
```

## Customizing

### Input Validation Timeout
By default a timeout of 100ms exists to wait after an input's trigger before the input's value gets validated. 
This prevents an input to not validate on every consecutive change. This default behavior can be changed by modifying the `VUE_FORMS_VALIDATION_TIMEOUT` value in the published `resources/assets/js/config.js` file.
Additionally this timeout value can be defined for each individual input by specifying a value for the key `timeout` on the input's rule object.

### Server Response Parsing
The form response handlers will look for specific keys on the response from the server to define the further actions (see 'Parsing responses from the server'). The keys can be customized by editing the `serverKeys` data on the file `resources/assets/js/mixins/AjaxFormMixin.js`.

### Loading Button
After the user clicks the submit button of a form component, a loading icon will automatically be inserted within the submit button. The content of the button can be customized by editing the `loadingContent` data on the file `resources/assets/js/mixins/AjaxFormMixin.js`.

## Helpers
### Sweet Alert Helpers
The package contains a helper file to easily show Sweet Alert messages using JavaScript. This file with its methods can be found at `resources/assets/js/helpers/Alert.js`.
Example:
```javascript
new Alert('my alert text', 'my alert title', 'info').show();
 ```

# 5. Credits
- The date component `FormDateInput` is based on [the Bootstrap datetimepicker by eonasdan](https://eonasdan.github.io/bootstrap-datetimepicker/).
- The alerts are handled by the [Sweetalert](https://sweetalert.js.org/) plugin
- The tooltips are handled by the [Tooltip.js](https://popper.js.org/tooltip-examples.html) plugin

# 6. License
[MIT](https://github.com/ferdinandfrank/vue-forms/blob/master/LICENSE)
