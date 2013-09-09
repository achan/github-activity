var githubActivity = (function() {
  var _options = {};

  var setOptions = function (options) {
    _options = options;
  };

  var getOptions = function () {
    return _options;
  };

  var formatFeed = function (events) {
    var output = '';

    for (var key in events)
      output += buildOutputForEvent(events[key]);

    return output === '' ? Mustache.render(_options.templates.NoEvents) :
                           output;
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

  var buildFetchEventsUrl = function (username) {
    return 'https://api.github.com/users/' +
           _options.username +
           '/events?callback=githubActivity.showActivity';
  };

  var activity = {
    showActivity: function(response) {
      if (!response) {
        var output = Mustache.render(getOptions().templates.NoEvents);
        return onCompleteCallback(output);
      }

      return onCompleteCallback(formatFeed(response.data));
    },

    requestActivity: function(options) {
      var script = options.doc.createElement('script');
      setOptions(options);
      script.src = buildFetchEventsUrl(options.username);
      options.doc.body.appendChild(script);
    }
  };

  return activity;
}) ();
