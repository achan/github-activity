var githubActivity = (function() {
  var activity = {
    formatFeed: function (templates, events) {
      if (!events)
        return Mustache.render(templates.NoEvents);

      var output = '';
      for (var key in events.data) {
        var event = events.data[key];
        var eventType = event.type;
        if (templates[eventType]) {
          event.created_at_in_words = moment(event.created_at).fromNow();
          output += Mustache.render(templates[eventType], event);
        }
      }

      return output === '' ? Mustache.render(templates.NoEvents) : output;
    }
  };

  return activity;
}) ();
