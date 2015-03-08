// Generated by CoffeeScript 1.8.0
var exec, gitExec, options, _;

exec = require('child_process').exec;

_ = require('underscore');

options = {
  cwd: './'
};

gitExec = function(cmd, timeout, callback, callbackIteration) {
  var error, git, result;
  if (timeout == null) {
    timeout = 10000;
  }
  if (typeof timeout === 'function') {
    callbackIteration = callback;
    callback = timeout;
    timeout = 10000;
  }
  result = '';
  try {
    git = exec("git " + cmd, {
      cwd: options.cwd
    });
    git.stdout.on('data', function(data) {
      data = data.trim();
      result += data;
      return typeof callbackIteration === "function" ? callbackIteration(data) : void 0;
    });
    git.stdout.on('error', function(data) {
      data = data.trim();
      result += data;
      return typeof callbackIteration === "function" ? callbackIteration(data) : void 0;
    });
    git.stderr.on('data', function(data) {
      data = data.trim();
      result += data;
      return typeof callbackIteration === "function" ? callbackIteration(data) : void 0;
    });
    git.stderr.on('error', function(data) {
      data = data.trim();
      result += data;
      return typeof callbackIteration === "function" ? callbackIteration(data) : void 0;
    });
    return git.stdout.on('close', function() {
      return typeof callback === "function" ? callback(result) : void 0;
    });
  } catch (_error) {
    error = _error;
    console.log(error);
    return typeof callback === "function" ? callback(null) : void 0;
  }
};

module.exports = {
  setOptions: function(opt) {
    return _.extend(options, opt);
  },
  getHash: function(fileName, callback) {
    return gitExec("log -n 1 --pretty=\"%H\" -- " + fileName, callback);
  },
  diffMaster: function(fileName, timeout, callback) {
    return gitExec("diff master -- " + fileName, timeout, callback);
  },
  checkout: function(branchName, timeout, callback) {
    return gitExec("checkout " + branchName, timeout, callback);
  },
  getBranchName: function(callback) {
    return gitExec("branch", function(result) {
      return result.split("\n").forEach(function(item) {
        if (item.indexOf('*') === 0) {
          return typeof callback === "function" ? callback(item.replace(/\*\s/g, '')) : void 0;
        }
      });
    });
  },
  createBranch: function(branchName, callback) {
    return gitExec("checkout -b " + branchName, callback);
  },
  add: function(callback) {
    return gitExec("add -A", callback);
  },
  commit: function(message, callback) {
    return gitExec("commit -am '" + message + "'", callback);
  },
  pull: function(callback) {
    return this.getBranchName(function(branch) {
      return gitExec("pull origin " + branch, callback);
    });
  },
  merge: function(branchName, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = '';
    }
    return gitExec("merge " + branchName + " " + options, callback);
  },
  push: function(callback, callbackIteration) {
    return this.getBranchName(function(branch) {
      return gitExec("push origin " + branch, callback, callbackIteration);
    });
  },
  fetch: function(callback) {
    return gitExec("fetch", callback);
  },
  getConflictList: function(callback) {
    return gitExec("diff --name-only --diff-filter=U", function(result) {
      return typeof callback === "function" ? callback(result.split("\n")) : void 0;
    });
  },
  getUncommittedList: function(callback) {
    return gitExec("diff --name-only", function(result) {
      return typeof callback === "function" ? callback(result.split("\n")) : void 0;
    });
  },
  getLastChanges: function(callback) {
    return gitExec('log -n 2 --pretty="%H"', function(hash) {
      var lastOtherHash;
      lastOtherHash = hash.split('\n')[1];
      if (!lastOtherHash) {
        lastOtherHash = hash.slice(hash.length / 2);
      }
      return gitExec("difftool " + lastOtherHash + " --name-status", callback);
    });
  },
  reset: function(callback) {
    return gitExec("reset --hard HEAD", callback);
  },
  removeLocalBranch: function(branchName, callback) {
    return gitExec("branch -D " + branchName, callback);
  },
  removeRemoteBranch: function(branchName, callback) {
    return gitExec("push origin --delete " + branchName, callback);
  }
};
