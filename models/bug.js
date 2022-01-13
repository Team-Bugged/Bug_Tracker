var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bugSchema = new Schema({
  createdBy: {
    type: String,
    require: true,
  },
  bugTitle: {
    type: String,
    require: true,
  },
  bugStatus: {
    type: String,
    require: true,
  },
  bugDescription: {
    type: String,
    require: true,
  },
  bugSeverity: {
    type: String,
    require: true,
  },
  // bugPriority: {
  //   type: String,
  //   require: true,
  // },
  bugDueDate: {
    type: String,
    require: true,
  },
  assignedTo: {
    type: Array,
  },
  // comments: {
  //     type: Array,
  // },
});

bugSchema.pre("save", function (next) {
  var bug = this;
  return next();
});

module.exports = mongoose.model("Bug", bugSchema);
