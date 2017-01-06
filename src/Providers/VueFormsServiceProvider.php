<?php

namespace EpicArrow\VueForms\Providers;

use EpicArrow\VueForms\Commands\InitVueForms;
use Illuminate\Support\ServiceProvider;

/**
 * VueFormsServiceProvider
 * -----------------------
 * Provides the necessary files to use the vue form components in the application.
 *
 * @author  Ferdinand Frank
 * @version 1.0
 * @package App\Providers
 */
class VueFormsServiceProvider extends ServiceProvider {

    /**
     * Bootstrap the application services.
     *
     * @return void
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
            VUE_FORMS_BASE_PATH . '/resources/lang' => resource_path('lang/'),
            VUE_FORMS_BASE_PATH . '/resources/assets' => resource_path('/assets/vendor/vue-forms'),
        ], 'vue-forms');
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register() {
        // Define package base path
        if (!defined('VUE_FORMS_BASE_PATH')) {
            define('VUE_FORMS_BASE_PATH', realpath(__DIR__ . '/../../'));
        }
    }
}
