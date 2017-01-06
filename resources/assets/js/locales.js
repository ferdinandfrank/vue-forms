export default {
    "de": {
        "alert": {
            "error": {
                "delete": {
                    "title": "Sorry",
                    "content": "Beim Löschen von {name} ist ein unbekannter Fehler aufgetreten. Bitte versuche es noch einmal."
                },
                "post": {
                    "title": "Sorry!",
                    "content": "Beim Erstellen ist ein unbekannter Fehler aufgetreten. Bitte versuche es noch einmal."
                },
                "put": {
                    "title": "Sorry!",
                    "content": "Beim Aktualisieren von {name} ist ein unbekannter Fehler aufgetreten. Bitte versuche es noch einmal."
                }
            },
            "default": {
                "delete": {
                    "title": "Gelöscht",
                    "content": "{name} wurde erfolgreich gelöscht."
                },
                "post": {
                    "title": "Gespeichert",
                    "content": "Die Daten wurden gespeichert."
                },
                "put": {
                    "title": "Gespeichert",
                    "content": "Die Änderungen an {name} wurden gespeichert."
                }
            }
        },
        "confirm": {
            "default": {
                "delete": {
                    "title": "Löschen",
                    "content": "Möchtest du {name} wirklich löschen?",
                    "accept": "Ja",
                    "cancel": "Nein"
                },
                "post": {
                    "title": "Erstellen",
                    "content": "Möchtest du das Objekt mit diesen Eingaben erstellen?",
                    "accept": "Ja",
                    "cancel": "Nein"
                },
                "put": {
                    "title": "Aktualisieren",
                    "content": "Möchtest du {name} mit diesen Eingaben aktualisieren?",
                    "accept": "Ja",
                    "cancel": "Nein"
                }
            }
        }
    },
    "en": {
        "alert": {
            "error": {
                "delete": {
                    "title": "Sorry",
                    "content": "An error occurred while trying to delete {name}. Please try again."
                },
                "post": {
                    "title": "Sorry!",
                    "content": "An error occurred while trying to save the data. Please try again."
                },
                "put": {
                    "title": "Sorry!",
                    "content": "An error occurred while trying to update {name}. Please try again."
                }
            },
            "default": {
                "delete": {
                    "title": "Deleted",
                    "content": "{name} has been deleted."
                },
                "post": {
                    "title": "Saved",
                    "content": "The data has been saved."
                },
                "put": {
                    "title": "Saved",
                    "content": "The changes on {name} have been saved."
                }
            }
        },
        "auth": {
            "failed": "These credentials do not match our records.",
            "throttle": "Too many login attempts. Please try again in {seconds} seconds."
        },
        "confirm": {
            "default": {
                "delete": {
                    "title": "Delete",
                    "content": "Do you really want to delete {name} ?",
                    "accept": "Yes",
                    "cancel": "No"
                },
                "post": {
                    "title": "Create",
                    "content": "Do you really want to save this data?",
                    "accept": "Yes",
                    "cancel": "No"
                },
                "put": {
                    "title": "Update",
                    "content": "Do you really want to update {name} with these changes?",
                    "accept": "Yes",
                    "cancel": "No"
                }
            }
        },
        "pagination": {
            "previous": "&laquo; Previous",
            "next": "Next &raquo;"
        },
        "passwords": {
            "password": "Passwords must be at least six characters and match the confirmation.",
            "reset": "Your password has been reset!",
            "sent": "We have e-mailed your password reset link!",
            "token": "This password reset token is invalid.",
            "user": "We can't find a user with that e-mail address."
        },
        "validation": {
            "accepted": "The {attribute} must be accepted.",
            "active_url": "The {attribute} is not a valid URL.",
            "after": "The {attribute} must be a date after {date}.",
            "after_or_equal": "The {attribute} must be a date after or equal to {date}.",
            "alpha": "The {attribute} may only contain letters.",
            "alpha_dash": "The {attribute} may only contain letters, numbers, and dashes.",
            "alpha_num": "The {attribute} may only contain letters and numbers.",
            "array": "The {attribute} must be an array.",
            "before": "The {attribute} must be a date before {date}.",
            "before_or_equal": "The {attribute} must be a date before or equal to {date}.",
            "between": {
                "numeric": "The {attribute} must be between {min} and {max}.",
                "file": "The {attribute} must be between {min} and {max} kilobytes.",
                "string": "The {attribute} must be between {min} and {max} characters.",
                "array": "The {attribute} must have between {min} and {max} items."
            },
            "boolean": "The {attribute} field must be true or false.",
            "confirmed": "The {attribute} confirmation does not match.",
            "date": "The {attribute} is not a valid date.",
            "date_format": "The {attribute} does not match the format {format}.",
            "different": "The {attribute} and {other} must be different.",
            "digits": "The {attribute} must be {digits} digits.",
            "digits_between": "The {attribute} must be between {min} and {max} digits.",
            "dimensions": "The {attribute} has invalid image dimensions.",
            "distinct": "The {attribute} field has a duplicate value.",
            "email": "The {attribute} must be a valid email address.",
            "exists": "The selected {attribute} is invalid.",
            "file": "The {attribute} must be a file.",
            "filled": "The {attribute} field is required.",
            "image": "The {attribute} must be an image.",
            "in": "The selected {attribute} is invalid.",
            "in_array": "The {attribute} field does not exist in {other}.",
            "integer": "The {attribute} must be an integer.",
            "ip": "The {attribute} must be a valid IP address.",
            "json": "The {attribute} must be a valid JSON string.",
            "max": {
                "numeric": "The {attribute} may not be greater than {max}.",
                "file": "The {attribute} may not be greater than {max} kilobytes.",
                "string": "The {attribute} may not be greater than {max} characters.",
                "array": "The {attribute} may not have more than {max} items."
            },
            "mimes": "The {attribute} must be a file of type{} {values}.",
            "mimetypes": "The {attribute} must be a file of type{} {values}.",
            "min": {
                "numeric": "The {attribute} must be at least {min}.",
                "file": "The {attribute} must be at least {min} kilobytes.",
                "string": "The {attribute} must be at least {min} characters.",
                "array": "The {attribute} must have at least {min} items."
            },
            "not_in": "The selected {attribute} is invalid.",
            "numeric": "The {attribute} must be a number.",
            "present": "The {attribute} field must be present.",
            "regex": "The {attribute} format is invalid.",
            "required": "The {attribute} field is required.",
            "required_if": "The {attribute} field is required when {other} is {value}.",
            "required_unless": "The {attribute} field is required unless {other} is in {values}.",
            "required_with": "The {attribute} field is required when {values} is present.",
            "required_with_all": "The {attribute} field is required when {values} is present.",
            "required_without": "The {attribute} field is required when {values} is not present.",
            "required_without_all": "The {attribute} field is required when none of {values} are present.",
            "same": "The {attribute} and {other} must match.",
            "size": {
                "numeric": "The {attribute} must be {size}.",
                "file": "The {attribute} must be {size} kilobytes.",
                "string": "The {attribute} must be {size} characters.",
                "array": "The {attribute} must contain {size} items."
            },
            "string": "The {attribute} must be a string.",
            "timezone": "The {attribute} must be a valid zone.",
            "unique": "The {attribute} has already been taken.",
            "uploaded": "The {attribute} failed to upload.",
            "url": "The {attribute} format is invalid.",
            "custom": {
                "attribute-name": {
                    "rule-name": "custom-message"
                }
            },
            "attributes": []
        }
    }
}
