var githubActivity = (function() {
  var _options = {};
  var formatFeed = function (events) {
    var output = '';

    for (var key in events)
      output += buildOutputForEvent(events[key]);

    return output === '' ? Mustache.render(_options.templates.NoEvents) : output;
  };

  var formatShaHelper = function () {
    return function (text, render) {
      return render(text).substring(0, 7);
    };
  };

  var buildOutputForEvent = function (event) {
    var eventType = event.type, templates = _options.templates;

    if (templates[eventType]) {
      augmentEvent(event, { formatSha: formatShaHelper, moment: moment });
      return Mustache.render(templates[eventType], event);
    }

    return '';
  };

  var augmentEvent = function (event, helpers) {
    event.formatSha = helpers.formatSha;
    event.created_at_in_words = helpers.moment(event.created_at).fromNow();
  };

  var onCompleteCallback = function (html) {
    _options.onCompleteCallback(html);
  };

  var activity = {
    showActivity: function(response) {
      if (!response)
        return onCompleteCallback(Mustache.render(_options.templates.NoEvents));

      return onCompleteCallback(formatFeed(response.data));
    },

    requestActivity: function(options) {
      _options = options;
      var script = _options.doc.createElement('script');
      script.src = 'https://api.github.com/users/' +
                   _options.username +
                   '/events?callback=githubActivity.showActivity';
      _options.doc.body.appendChild(script);
    }
  };

  return activity;
}) ();
