<?php

namespace EpicArrow\VueForms\Commands;

use Illuminate\Console\Command;

class InitVueForms extends Command {

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'vue-forms:init';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Initializes the vue-forms plugin.';

    /**
     * Execute the console command.
     */
    public function handle() {
        \Artisan::call('vendor:publish', ['--tag' => 'vue-forms', '--force' => true]);
        echo "VueForms resources published." . PHP_EOL;
    }
}
