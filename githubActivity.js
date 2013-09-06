var githubActivity = (function() {
  var activity = {
    formatFeed: function (templates, events) {
      if (!events)
        return Mustache.render(templates.NoEvents);

      var output = '';
      for (var key in events.data) {
        var event = events.data[key];
        var eventType = event.type;
        if (templates[eventType])
          output += Mustache.render(templates[eventType], event);
      }

      return output === '' ? Mustache.render(templates.NoEvents) : output;
    }
  };

  return activity;
}) ();
