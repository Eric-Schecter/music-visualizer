module.exports = function (source) {
  const includePattern = /^[ \t]*#include +<([\w\d./]+)>/gm;
  const str = JSON.stringify(source);
  str.replace(includePattern,(match,include)=>{
    console.log(match,include);
    return match;
  })
  return `module.exports = ${JSON.stringify(source)}`;
}