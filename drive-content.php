<?php
/**
 * Plugin Name: Drive Content
 * Description: A plugin to allow you to add your Drive Content assets to your wordpress site.
 * Version: 0.1.0
 * Author: AutoNetTv Media, Inc
 * Author URI: http://www.autonettv.com
 * License: Copyright
 * Copyright 2014  AutoNetTv Media, Inc  (email : chasen@autonettv.com)
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 */

class AntvDriveContent{

    public function appendDriveContentButton(){
        echo '<a href="#" class="button add_media" id="insert-drive-content" data-remote="'.plugins_url('/views/login.html', __FILE__).'"><span class="wp-media-buttons-icon"></span> Insert Drive Content</a>';
    }

    public function appendDriveContentModal()
    {
        include(dirname(__FILE__).'/views/modal.html');
    }

    public function saveAccessId()
    {
        set_transient('drive_content_ws_access_id',$_POST['ws_access_id'],60*60*24);
    }


    public function addScripts()
    {
        $variables = array(
            'spinnerUrl' => admin_url('images/spinner.gif'),
            'registerImgUrl' => plugins_url('/assets/register.png', __FILE__),
            'driveContentTemplateUrl' => plugins_url('/views/drive-content.twig', __FILE__),
            'driveLoginTemplateUrl' => plugins_url('/views/login.twig', __FILE__),
            'ws_access_id' => get_transient('drive_content_ws_access_id')
        );
        wp_register_script('antv-drive-content', plugins_url('/js/drive-content.js', __FILE__), array('jquery'), false, true);
        wp_localize_script('antv-drive-content', 'drive_content', $variables );
        wp_enqueue_script('antv-drive-content');

        wp_enqueue_style('antv-drive-content', plugins_url('/css/drive-content.css', __FILE__), array(), false, 'all');

        wp_enqueue_script('antv-bootstrap', plugins_url('/js/bootstrap.js', __FILE__), array('jquery'), false, false);
        wp_enqueue_style('antv-bootstrap', plugins_url('/css/bootstrap.css', __FILE__), array(), false, 'all');

        wp_enqueue_script('twigjs', plugins_url('/js/twig.min.js', __FILE__), array('jquery'), false, false);
        wp_enqueue_script('xml-to-json', plugins_url('/js/jquery.xml2json.js', __FILE__), array('jquery'), false, false);
    }

    public function driveContentShortCode($atts)
    {
        $args = shortcode_atts( array(
            'url' => null,
            'width' => null,
            'height' => null,
        ), $atts );
        return '<iframe width="'.$args['width'].'" height="'.$args['height'].'" src="'.$args['url'].'" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>';
    }

}

add_action('media_buttons',array('AntvDriveContent','appendDriveContentButton'));
add_action('admin_footer',array('AntvDriveContent','appendDriveContentModal'));
add_filter('admin_enqueue_scripts', array('AntvDriveContent','addScripts'));
add_shortcode( 'driveContent', array('AntvDriveContent','driveContentShortCode') );
add_action( 'wp_ajax_save_access_id', array('AntvDriveContent','saveAccessId') );