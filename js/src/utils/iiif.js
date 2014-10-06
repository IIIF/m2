
(function($) {

  $.Iiif = {

    // Temporary method to create Stanford IIIF URI from Stanford stacks non-IIIF URI
    getUri: function(uri) {
      var iiifUri = uri,
      match = /http?:\/\/stacks.stanford.edu\/image\/(\w+\/\S+)/i.exec(uri);

      if (match && match.length === 2) {
        iiifUri = 'https://stacks.stanford.edu/image/iiif/' + encodeURIComponent(match[1]);
      }

      return iiifUri;
    },
    
    getImageUrl: function(image) {

      if (!image.images[0].resource.service) {
        id = image.images[0].resource['default'].service['@id'];
        id = id.replace(/\/$/, "");
        return id;
      }
      
      var id = image.images[0].resource.service['@id'];
      id = id.replace(/\/$/, "");

      return id;
    },

    getVersionFromContext: function(context) {
      if (context == "http://iiif.io/api/image/2/context.json") {
        return "2.0";
      } else {
        return "1.1";
      }
    },

    makeUriWithWidth: function(uri, width, version) {
      uri = uri.replace(/\/$/, '');
      if (version[0] == '1') {
        return this.getUri(uri) + '/full/' + width + ',/0/native.jpg';
      } else {
        return this.getUri(uri) + '/full/' + width + ',/0/default.jpg';
      }
    },

    getImageHostUrl: function(json) {
      var regex,
          matches = [];

      if (!json.hasOwnProperty('image_host')) {

        json.image_host = json.tilesUrl || json['@id'] || '';

       if (json.hasOwnProperty('identifier')) {
          regex = new RegExp('/?' + json.identifier + '/?$', 'i');
          json.image_host = json.image_host.replace(regex, '');

        } else {
          regex = new RegExp('(.*)\/(.*)$');
          matches = regex.exec(json.image_host);

          if (matches.length > 1) {
            json.image_host = matches[1];
            json.identifier = matches[2];
          }
        }
      }

      return json.image_host;
    },


    packageScaleFactors: function(json) {
      var newScaleFactors = [];

      if (json.hasOwnProperty('scale_factors') && jQuery.isArray(json.scale_factors)) {
        for (var i = 0; i < json.scale_factors.length; i++) {
          newScaleFactors.push(i);
        }
      }

      return newScaleFactors;
    }

  };


}(Mirador));

