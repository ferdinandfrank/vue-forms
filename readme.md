# Local Date


### Introduction
Local Date provides a simple extension of the [Carbon](http://carbon.nesbot.com/) date format to use in [Laravel](https://laravel.com) with localization.

### Requirements

- [PHP](https://php.net) >= 5.6
- An existing [Laravel 5.3](https://laravel.com/docs/master/installation) project

### Installation

To get started, install the Local Date extension via the Composer package manager: 
```bash
composer require epicarrow/local-date
```

### Configuration

To change the localization messages, execute the following command within your laravel installation:
```bash
php artisan vendor:publish --tag=local-date --force
```
