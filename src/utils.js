function normalizeTel(val) {
  if (!val) return false;
  val = val.replace(/[^\d+]/g, ''); // Remove non-numericals except +

  if (val.indexOf('+') !== 0) {
    val = (val.indexOf('1') === 0) ? '+' + val : '+1' + val;
  }

  return val;
}

function validateMapboxEmail(email) {
  var re = /^([\w-]+(?:\.[\w-]+)*)@mapbox.com/i;
  return re.test(email);
};

export default { normalizeTel, validateMapboxEmail };
