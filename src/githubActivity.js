var githubActivity = (function() {
  var _options = {};
  var formatFeed = function (events) {
    templates = _options.templates;

    var output = '';
    var formatSha = function () {
      return function (text, render) {
        return render(text).substring(0, 7);
      };
    };

    for (var key in events) {
      var event = events[key];
      var eventType = event.type;
      if (templates[eventType]) {
        event.formatSha = formatSha;
        event.created_at_in_words = moment(event.created_at).fromNow();
        output += Mustache.render(templates[eventType], event);
      }
    }

    return output === '' ? Mustache.render(templates.NoEvents) : output;
  };

  var activity = {
    showActivity: function(response) {
      if (!response)
        return Mustache.render(_options.templates.NoEvents);

      return formatFeed(response.data);
    },

    requestActivity: function(options) {
      _options = options;
      _options.doc.createElement('script').src = 'https://api.github.com/users/' +
                                                 _options.username +
                                                 '/events?callback=githubActivity.showActivity';
    }
  };

  return activity;
}) ();
