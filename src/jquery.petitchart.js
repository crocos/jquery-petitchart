/**
 * jquery.petitchart.js
 * Copyright (c) 2013 Crocos Inc., All rights reserved.
 *
 * @author Keisuke SATO <sato@crocos.co.jp>
 * @license BSD License
 */

;(function($){

  'use strict';

  var NS = 'http://www.w3.org/2000/svg'
    , $create = function(tag) {
        var elm = document.createElementNS(NS, tag);

        return $(elm);
      }
    , parseData = function(options) {
        var data = options.data.split(',')
          , ret = []
          , max = Math.max.apply(null, data)
          // , min = Math.min.apply(null, data)
          , per = 100 / max;

        $.each(data, function(i, val) {
          ret[ret.length] = {
            val: val,
            per: val * per
          };
        });

        options.data = ret;

        return options;
      }
    , draw = function($svg, options) {
        var len = options.data.length
          , type = options.type || 'bar';
        options.yper = options.height / 100;
        options.xwid = (options.width - (options.span * (len - 1))) / len;

        $svg.attr({
          viewBox: [0, 0, options.width, options.height].join(' '),
          width: options.width,
          height: options.height
        });

        switch (type) {
          case 'line':
            drawLineChart($svg, options.data, options);
            break;
          case 'bar':
          default:
            drawBarChart($svg, options.data, options);
            break;
        }
      }
    , drawBarChart = function($svg, data, options) {
        $.each(data, function(i, val) {
          var $rect = $create('rect')
            , height = val.per * options.yper
            , x = (options.xwid * i) + (options.span * i)
            , y = options.height - height;

          $rect.attr({
            x: x,
            y: y,
            width: options.xwid,
            height: height,
            fill: options.color,
            'stroke-width': 1,
            stroke: options.color
          });
          $svg.append($rect);
        });
      }
    , drawLineChart = function($svg, data, options) {
        var $line = $create('polyline')
          , attr = {}
          , points = []
          ;

        $.each(data, function(i, val) {
          var y = options.height - (val.per * options.yper)
            , x = ((options.xwid + options.span) * i) + ((options.xwid) / 2)
            ;
          points.push(x + " " + y);
        });
        $line.attr({
          points: points.join(','),
          fill: "none",
          'stroke-width': (options.width > 200) ? 2 : 1,
          stroke: options.color
        });
        $svg.append($line);
      }
      ;

  $.fn.petitchart = function(options) {
    var options = parseData($.extend({}, $.fn.petitchart.defaults, options))
      , $self = $(this)
      , $svg = $create('svg');

    draw($svg, options);

    $self.append($svg);
  };

  // defaults
  $.fn.petitchart.defaults = {
    data: [],
    color: 'red',
    width: 100,
    height: 20,
    span: 5,
    base: 0
  };

  // auto-execution
  $(function() {
    $('[data-petitchart]').each(function() {
      var $self = $(this)
        , args = {}
        , NS = 'data-petitchart';

      args.data = $self.attr(NS);

      $.each(['color', 'width', 'height', 'type'], function() {
        var val = $self.attr([NS, this].join('-'));

        if (val) {
          args[this] = val;
        }
      });

      if (args.data) {
        $self.petitchart(args);
      }
    });
  });
}(jQuery));
