var template = {};

/* 
 * Match functions 
*/

template.matchNodeById = 
 matchNodeById = function(node, nodekeyoption){
  nodekeyoption = nodekeyoption || 'n';
  node.id = typeof node.id === "number" ? node.id : parseInt(node.id);
  var match_node = "MATCH ("+nodekeyoption+") WHERE id("+nodekeyoption+") = "+node.id+ " ";
  return {msg: match_node, key: nodekeyoption};
};
// match (n)-[:LIKES]->(b) where id(n) = 406842 return b
/* 
 * Lable functions 
*/

template.addRelationshipTemplate =
 addRelationshipTemplate = function(startnodekey, endnodekey, relString) {
  relString = relString.toUpperCase();
  return "CREATE ("+startnodekey+")-[:"+relString+"]->("+endnodekey+") ";
};

template.removeRelationshipTemplate =
 removeRelationshipTemplate = function(startnodekey, endnodekey, relString) {
  relString = relString.toUpperCase();
  return "REMOVE ("+startnodekey+")-[:"+relString+"]->("+endnodekey+") ";
};

/* 
 * Message maker functions 
*/

template.updateLikeStatusStatementFromObject = 
 updateLikeStatusStatementFromObject = function(userid, inventoryChangeArray){
  matchedNode = template.matchNodeById(userid);
  msg = matchedNode.msg;
  userkey = matchedNode.key;

  for (var i = 0; i < inventoryChangeArray; i++){
    ing = inventoryChangeArray[i];
    ingkey = matchNodeById(inventoryChangeArray[i], 'node'+i).key ;
    if (ing.liked) { 
      msg+= template.addRelationshipTemplate(userkey, ingkey, 'LIKES');
    } else if (!ing.liked) {
      msg+= template.removeRelationshipTemplate(userkey, ingkey, 'LIKES');
    } else {
      console.log("unaccounted ingredient status: ",ing);
    }
  }
  return msg;
};

module.exports = template;