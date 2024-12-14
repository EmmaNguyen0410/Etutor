# Contributing instruction

## Add new page
These are steps to create a Login page:

1. Create new file login.hbs in views folder
2. Add 2 types of script into login.hbs

- scripts used by all pages:

```html
<!-- begin::Global Config(global config for global JS sciprts) -->
<script>
    var KTAppOptions = {
        "colors": {
            "state": {
                "brand": "#5d78ff",
                "dark": "#282a3c",
                "light": "#ffffff",
                "primary": "#5867dd",
                "success": "#34bfa3",
                "info": "#36a3f7",
                "warning": "#ffb822",
                "danger": "#fd3995"
            },
            "base": {
                "label": [
                    "#c5cbe3",
                    "#a1a8c3",
                    "#3d4465",
                    "#3e4466"
                ],
                "shape": [
                    "#f0f3ff",
                    "#d9dffa",
                    "#afb4d4",
                    "#646c9a"
                ]
            }
        }
    };
</script>
<!-- end::Global Config -->

<!--begin::Global Theme Bundle(used by all pages) -->
<script src="../plugins/global/plugins.bundle.js" type="text/javascript"></script>
<script src="../js/scripts.bundle.js" type="text/javascript"></script>
<!--end::Global Theme Bundle -->
```
- scripts used by your own page:

```html
<!--begin::Page Scripts(used by this page) -->
{{#each thisPageScripts}}
    <script src="{{this}}"></script>
{{/each}}
<!--end::Page Scripts -->
```

3. Add javascript file login.js in assets/js/et-pages


4. Render login page by express

```javascript
    login(req, res){
        res.render('login', {
            title: "Etutoring",
            thisPageStyleSheets: ['../css/pages/login/login-1.css'], //css file for this page only
            thisPageScripts: ['../js/et-pages/login.js'], //javascript file for this page only
            layout: 'auth' //other pages use 'main' layout. ONLY login, signup use 'auth' layout
        })        
    }
```


## Coding convention

1. Name convention

- Class: a noun in mixed case starting with uppercase (Authentication, UserManagement,...)

- Variable: a noun in mixed case starting with lowercase (userInfo, userId,..)

- Method: a verb or verb phrase in mixed case starting with lowercase (loginPage, createUser,...)

- DOM Elements: have '$' prefix ($loginForm, $signUpButton,...)

- File/Folder: all lower case. use "-" to separate a word phrase (list-view.js, chat-group.js,...)

2. Passing parameter into function MUST BE AN OBJECT. Recommend using object destructuring 

```javascript
function showErrorMsg(params) {
    console.log(params.key1)
    console.log(params.key2)
}

//with destructuring
function showErrorMsg({ key1, key2 }) {
    console.log(key1)
    console.log(key2)
}
```
3. Create new Controller

All controllers MUST BE A CLASS. For example, Authentication controller:

```javascript
class Authentication {
    login(req, res) {
        //your code
    }
    logout(req, res) {
        //your code
    }
}
module.exports = new Authentication()

```

4. Comment

Using comment with class and method initialization including: description about what it does, parameter, and return

```javascript
/**
 * Creates a new Circle from a diameter.
 *
 * @param {Number} d The desired diameter of the circle.
 * @return {Circle} The new Circle object.
 */
function fromDiameter(d) {
    return new Circle(d / 2)
}
```


