Model.InstanceMethods = {
  asJSON: function() {
    return this.attr()
  },

  attr: function(name, value) {
    if (arguments.length === 0) {
      // Combined attributes/changes object.
      return Model.Utils.extend({}, this.attributes, this.changes);
    } else if (arguments.length === 2) {
      // Don't write to attributes yet, store in changes for now.
      if (this.attributes[name] === value) {
        // Clean up any stale changes.
        delete this.changes[name];
      } else {
        this.changes[name] = value;
      }
      return this;
    } else if (typeof name === "object") {
      // Mass-assign attributes.
      for (var key in name) {
        this.attr(key, name[key]);
      }
      return this;
    } else {
      // Changes take precedent over attributes.
      return (name in this.changes) ?
        this.changes[name] :
        this.attributes[name];
    }
  },

  destroy: function(callback) {
    this.constructor.destroy(this, callback);
    return this;
  },

  id: function() {
    return this.attributes[this.constructor.unique_key];
  },

  merge: function(attributes) {
    Model.Utils.extend(this.attributes, attributes);
    return this;
  },

  newRecord: function() {
    return this.id() === undefined
  },

  reset: function() {
    this.errors.clear();
    this.changes = {};
    return this;
  },

  save: function(callback) {
    if (this.valid()) {
      this.constructor.save(this, callback);
    } else if (callback) {
      callback(false);
    }

    return this;
  },

  valid: function() {
    this.errors.clear();
    this.validate();
    return this.errors.size() === 0;
  },

  validate: function() {
    return this;
  }
};
