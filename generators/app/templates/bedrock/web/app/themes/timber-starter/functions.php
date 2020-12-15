<?php
/**
 * Timber starter-theme
 * https://github.com/timber/starter-theme
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since   Timber 0.1
 */

/**
 * If you are installing Timber as a Composer dependency in your theme, you'll need this block
 * to load your dependencies and initialize Timber. If you are using Timber via the WordPress.org
 * plug-in, you can safely delete this block.
 */
$composer_autoload = __DIR__ . '/vendor/autoload.php';
if ( file_exists( $composer_autoload ) ) {
	require_once $composer_autoload;
	$timber = new Timber\Timber();
}

/**
 * This ensures that Timber is loaded and available as a PHP class.
 * If not, it gives an error message to help direct developers on where to activate
 */
if ( ! class_exists( 'Timber' ) ) {

	add_action(
		'admin_notices',
		function() {
			echo '<div class="error"><p>Timber not activated. Make sure you activate the plugin in <a href="' . esc_url( admin_url( 'plugins.php#timber' ) ) . '">' . esc_url( admin_url( 'plugins.php' ) ) . '</a></p></div>';
		}
	);

	add_filter(
		'template_include',
		function( $template ) {
			return get_stylesheet_directory() . '/static/no-timber.html';
		}
	);
	return;
}

/**
 * Sets the directories (inside your theme) to find .twig files
 */
Timber::$dirname = array( 'templates', 'views' );

/**
 * By default, Timber does NOT autoescape values. Want to enable Twig's autoescape?
 * No prob! Just set this value to true
 */
Timber::$autoescape = false;

/**
 * Used for busting cache on styles/scripts.
 */
function cacheBust($versionNumber = null) {
	if($versionNumber && WP_ENV !== 'development') {
		return $versionNumber;
	} elseif ( WP_ENV == 'development' ) {
		return md5(rand());
	} else {
		return null;
	}
};

/**
 * We're going to configure our theme inside of a subclass of Timber\Site
 * You can move this to its own file and include here via php's include("MySite.php")
 */
class StarterSite extends Timber\Site {
	/** Add timber support. */
	public function __construct() {
		add_action( 'after_setup_theme', array( $this, 'theme_supports' ) );
		add_filter( 'timber/context', array( $this, 'add_to_context' ) );
		add_filter( 'timber/twig', array( $this, 'add_to_twig' ) );
		add_action( 'init', array( $this, 'register_post_types' ) );
		add_action( 'init', array( $this, 'register_taxonomies' ) );
		add_action( 'init', array( $this, 'register_scripts' ) );

		// Remove stupid wp-emoji script and styles
		add_action( 'init', array( $this, 'remove_emojis_frontend' ) );

		// Remove default block theme
		add_action( 'wp_enqueue_scripts', array( $this, 'remove_block_library_css' ) );

		// add custom theme styles
		add_action( 'wp_enqueue_scripts', array( $this, 'add_theme_scripts' ) );

		// Disable Gutenberg editor
		add_filter('use_block_editor_for_post', array( $this, '__return_false'), 10);

		// Add ACF Pro website options page
		if( function_exists('acf_add_options_page') ) {
			acf_add_options_page();
		}

		add_action('acf/init', array( $this, 'my_acf_init' ) );

		parent::__construct();
	}
	/** This is where you can register custom post types. */
	public function register_post_types() {

	}
	/** This is where you can register custom taxonomies. */
	public function register_taxonomies() {

	}

	/** This is where you add some context
	 *
	 * @param string $context context['this'] Being the Twig's {{ this }}.
	 */
	public function add_to_context( $context ) {
		$context['foo']   = 'bar';
		$context['stuff'] = 'I am a value set in your functions.php file';
		$context['notes'] = 'These values are available everytime you call Timber::context();';
		$context['menu']  = new Timber\Menu();

		if( class_exists('ACF') ) {
			$context['options'] = get_fields('option');
		}

		$context['site']  = $this;
		return $context;
	}

	public function theme_supports() {
		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

		/*
		 * Let WordPress manage the document title.
		 * By adding theme support, we declare that this theme does not use a
		 * hard-coded <title> tag in the document head, and expect WordPress to
		 * provide it for us.
		 */
		add_theme_support( 'title-tag' );

		/*
		 * Enable support for Post Thumbnails on posts and pages.
		 *
		 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		add_theme_support( 'post-thumbnails' );

		/*
		 * Switch default core markup for search form, comment form, and comments
		 * to output valid HTML5.
		 */
		add_theme_support(
			'html5',
			array(
				'comment-form',
				'comment-list',
				'gallery',
				'caption',
			)
		);

		/*
		 * Enable support for Post Formats.
		 *
		 * See: https://codex.wordpress.org/Post_Formats
		 */
		add_theme_support(
			'post-formats',
			array(
				'aside',
				'image',
				'video',
				'quote',
				'link',
				'gallery',
				'audio',
			)
		);

		add_theme_support( 'menus' );
	}

	/** This Would return 'foo bar!'.
	 *
	 * @param string $text being 'foo', then returned 'foo bar!'.
	 */
	public function myfoo( $text ) {
		$text .= ' bar!';
		return $text;
	}

	/**
	 * preg_replace for use in twig
	 */
	public function twig_regex($subject, $pattern, $replacement) {
	    return preg_replace($pattern, $replacement, $subject);
	}

	/** This is where you can add your own functions to twig.
	 *
	 * @param string $twig get extension.
	 */
	public function add_to_twig( $twig ) {
		$twig->addExtension( new Twig\Extension\StringLoaderExtension() );
		$twig->addFilter( new Twig\TwigFilter( 'myfoo', array( $this, 'myfoo' ) ) );
		$twig->addFilter( new Twig\TwigFilter('preg_replace', array( $this, 'twig_regex') ) );
		return $twig;
	}

	//------------------------------------
	// Register scripts and styles
	//------------------------------------
	function register_scripts() {

		//wp_register_style('type-kit-fonts', 'https://use.typekit.net/jup0oph.css'); // how to add fonts

		if(WP_ENV == 'production') {
			// Styles
			wp_register_style('style', get_template_directory_uri() . '/static/css/styles.min.css', array(), cacheBust('1.0.0'));
			// Scripts
			wp_register_script('main-js', get_template_directory_uri() . '/static/js/main.min.js', array(), cacheBust(), true);
		} else {
			// Styles
			wp_register_style('style', get_template_directory_uri() . '/static/css/styles.css', array(), cacheBust('1.0.0'));
			// Scripts
			wp_register_script('main-js', get_template_directory_uri() . '/static/js/main.js', array(), cacheBust(), true);
		}
	}

	//------------------------------------
	// Add styles/scripts for custom theme
	//------------------------------------
	function add_theme_scripts($wp_scripts) {
		if( is_admin() ) {
	        return;
	    }

		// Put jquery in footer
		wp_scripts()->add_data( 'jquery', 'group', 1 );
	    wp_scripts()->add_data( 'jquery-core', 'group', 1 );
	    wp_scripts()->add_data( 'jquery-migrate', 'group', 1 );

		// add main.js to page
		wp_enqueue_script('main-js');

		// add styles to page
		wp_enqueue_style('style');
	}

	//------------------------------------
	// Remove default wordpress block theme css
	//------------------------------------
	function remove_emojis_frontend() {
		remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
		remove_action( 'wp_print_styles', 'print_emoji_styles');
	}

	//------------------------------------
	// Remove default wordpress block theme css
	//------------------------------------
	function remove_block_library_css(){
	    wp_dequeue_style( 'wp-block-library' );
	    wp_dequeue_style( 'wp-block-library-theme' );
	}

}

new StarterSite();
