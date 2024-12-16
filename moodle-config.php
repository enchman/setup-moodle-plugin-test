<?php

$env = static function(string $key, ?string $default = null): string {
    $env = getenv($key);
    if ($env) {
        return $env;
    }
    if ($default === null) {
        throw new Exception("Environment variable {$key} is not set.");
    }
    return $default;
};

global $CFG;
$CFG = new stdClass();

$CFG->dbtype    = $env('DB_TYPE', 'mysqli');
$CFG->dblibrary = 'native';
$CFG->dbhost    = '127.0.0.1';
$CFG->dbname    = $env('DB_NAME', 'test');
$CFG->dbuser    = $env('DB_USER', 'test');
$CFG->dbpass    = $env('DB_PASS', 'test');
$CFG->prefix    = 'm_';
$CFG->dboptions = [
    'dbcollation' => $env('DB_COLLATION', 'utf8mb4_bin'),
];

$host = 'localhost';
$CFG->wwwroot   = "http://{$host}";
$CFG->dataroot  = realpath(dirname(__DIR__)) . '/moodledata';
$CFG->admin     = 'admin';
$CFG->directorypermissions = 0777;

$CFG->debug = E_ALL | E_STRICT;
$CFG->debugdisplay = 1;
$CFG->debugstringids = 1;
$CFG->perfdebug = 15;
$CFG->debugpageinfo = 1;
$CFG->allowthemechangeonurl = 1;
$CFG->passwordpolicy = 0;
$CFG->cronclionly = 0;
$CFG->pathtophp = $env('PHP_BIN');

$CFG->phpunit_dataroot  = realpath(dirname(__DIR__)) . '/phpunitdata';
$CFG->phpunit_prefix = 't_';

define('TEST_EXTERNAL_FILES_HTTP_URL', "http://$host:8080");
define('TEST_EXTERNAL_FILES_HTTPS_URL', "http://$host:8080");

define('TEST_SESSION_REDIS_HOST', $host);
define('TEST_CACHESTORE_REDIS_TESTSERVERS', $host);

require_once(__DIR__ . '/lib/setup.php');
