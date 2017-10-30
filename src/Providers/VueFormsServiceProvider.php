<?php

namespace FerdinandFrank\VueForms\Providers;

use FerdinandFrank\VueForms\Commands\InitVueForms;
use Illuminate\Support\ServiceProvider;

/**
 * VueFormsServiceProvider
 * -----------------------
 * Provides the necessary files to use the vue form components in the application.
 *
 * @author  Ferdinand Frank
 */
class VueFormsServiceProvider extends ServiceProvider {

    /**
     * Bootstraps the application services.
     */
    public function boot() {

        // Load language files
        $this->loadTranslationsFrom(VUE_FORMS_BASE_PATH . '/resources/lang', 'vue-forms');

        if ($this->app->runningInConsole()) {
            $this->commands([
                InitVueForms::class
            ]);
        }

        $this->publishes([
            VUE_FORMS_BASE_PATH . '/resources/assets' => resource_path('/assets/vendor/vue-forms'),
        ], 'vue-forms');
    }

    /**
     * Registers the application services.
     */
    public function register() {

        // Define package base path
        if (!defined('VUE_FORMS_BASE_PATH')) {
            define('VUE_FORMS_BASE_PATH', realpath(__DIR__ . '/../../'));
        }
    }
}
