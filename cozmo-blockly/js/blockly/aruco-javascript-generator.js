/**
 * @fileoverview Generating JavaScript for Aruco Marker blocks.
 * @author maxosprojects
 */
'use strict';

goog.provide('Blockly.JavaScript.aruco');

goog.require('Blockly.JavaScript');

Blockly.JavaScript['aruco_adjust_angles'] = function(block) {
  var x = block.getFieldValue('X');
  var y = block.getFieldValue('Y');
  var z = block.getFieldValue('Z');
  // var code = 'bot.adjustGroundAngles(' + x + ', ' + y + ', ' + z + ')\n';
  var code = '';
  return code;
};

Blockly.JavaScript['aruco_character'] = function(block) {
  var id = Blockly.JavaScript.getIntOrVar(block, 'ID');
  var body = block.getInputTargetBlock('BODY');
  var elements = Blockly.JavaScript.blockToCode(body);
  if (elements.length == 0) {
    return '';
  }
  var code = 'var character = {"elements": []};\n';
  code += 'character["id"] = ' + id + ';\n';
  code += elements + '\n';
  code += 'Code.cozmo3d.onData({"character": character});\n';
  return code;
};

Blockly.JavaScript['aruco_character_static'] = function(block) {
  var name = Blockly.JavaScript.valueToCode(block, 'CHAR_NAME', Blockly.JavaScript.ORDER_NONE);
  var body = block.getInputTargetBlock('BODY');
  var elements = Blockly.JavaScript.blockToCode(body);
  if (elements.length == 0) {
    return '';
  }
  var code = 'var character = {"static": true, "elements": []};\n';
  code += 'character["id"] = ' + name + ';\n';
  code += elements + '\n';
  code += 'Code.cozmo3d.onData({"character": character});\n';
  return code;
};

Blockly.JavaScript['aruco_character_texture'] = function(block) {
  if (!hasCharParent(block, 'aruco_character')) {
    return '';
  }
  var texture = Blockly.JavaScript.valueToCode(block, 'TEXTURE', Blockly.JavaScript.ORDER_NONE);
  var code = 'character["texture"] = ' + texture + ';\n';
  return code;
};

Blockly.JavaScript['aruco_character_move_by'] = function(block) {
  if (!hasCharParent(block, 'aruco_character')) {
    return '';
  }
  var moveby = Blockly.JavaScript.valueToCode(block, 'MOVE_BY', Blockly.JavaScript.ORDER_NONE);
  var code = 'character["moveby"] = ' + moveby + ';\n';
  return code;
};

Blockly.JavaScript['aruco_character_scale'] = function(block) {
  if (!hasCharParent(block, 'aruco_character')) {
    return '';
  }
  var scale = Blockly.JavaScript.valueToCode(block, 'SCALE', Blockly.JavaScript.ORDER_NONE);
  var code = 'character["scale"] = ' + scale + ';\n';
  return code;
};

Blockly.JavaScript['aruco_rotate'] = function(block) {
  if (!hasCharParent(block, 'aruco_character')) {
    return '';
  }
  var pivot = Blockly.JavaScript.valueToCode(block, 'PIVOT', Blockly.JavaScript.ORDER_NONE);
  var angles = Blockly.JavaScript.valueToCode(block, 'ANGLES', Blockly.JavaScript.ORDER_NONE);
  var rotate = '{"pivot": ' + pivot + ', "angles": ' + angles + '}';
  var code;
  if (Blockly.JavaScript.hasParent(block, 'aruco_element')) {
    code = 'element["rotate"] = ' + rotate + ';\n';
  } else {
    code = 'character["rotate"] = ' + rotate + ';\n';
  }
  return code;
};

Blockly.JavaScript['aruco_animate'] = function(block) {
  if (!hasCharParent(block, 'aruco_character')) {
    return '';
  }
  var local = block.getFieldValue('LOCAL') === 'TRUE';
  var andBack = block.getFieldValue('AND_BACK') === 'TRUE';
  var loop = block.getFieldValue('LOOP') === 'TRUE';
  var pivot = Blockly.JavaScript.valueToCode(block, 'PIVOT', Blockly.JavaScript.ORDER_NONE);
  var anglesStart = Blockly.JavaScript.valueToCode(block, 'ANGLES_START', Blockly.JavaScript.ORDER_NONE);
  var anglesStop = Blockly.JavaScript.valueToCode(block, 'ANGLES_STOP', Blockly.JavaScript.ORDER_NONE);
  var duration = Blockly.JavaScript.getFloatOrVar(block, 'DURATION');
  var animate = '{"pivot": ' + pivot + ', "anglesStart": ' + anglesStart + ', "anglesStop": ' + anglesStop + ', "duration": ' + duration + '}';
  var animate = '{\n';
  animate += Blockly.JavaScript.INDENT + '"local": ' + local + ',\n';
  animate += Blockly.JavaScript.INDENT + '"andBack": ' + andBack + ',\n';
  animate += Blockly.JavaScript.INDENT + '"loop": ' + loop + ',\n';
  animate += Blockly.JavaScript.INDENT + '"pivot": ' + pivot + ',\n';
  animate += Blockly.JavaScript.INDENT + '"anglesStart": ' + anglesStart + ',\n';
  animate += Blockly.JavaScript.INDENT + '"anglesStop": ' + anglesStop + ',\n';
  animate += Blockly.JavaScript.INDENT + '"duration": ' + duration + '\n';
  animate += '}';
  var code;
  if (Blockly.JavaScript.hasParent(block, 'aruco_element')) {
    code = 'element["animate"] = ' + animate + ';\n';
  } else {
    code = 'character["animate"] = ' + animate + ';\n';
  }
  return code;
};

Blockly.JavaScript['aruco_element'] = function(block) {
  if (!hasCharParent(block, 'aruco_character')) {
    return '';
  }
  var name = block.getFieldValue('ELEM_NAME');
  var size = Blockly.JavaScript.valueToCode(block, 'SIZE', Blockly.JavaScript.ORDER_NONE);
  var moveby = Blockly.JavaScript.valueToCode(block, 'MOVE_BY', Blockly.JavaScript.ORDER_NONE);
  var element = '{"name": "' + name + '", "size": ' + size + ', "moveby": ' + moveby + '}';
  var branch = Blockly.JavaScript.statementToCode(block, 'BODY');
  branch = Blockly.JavaScript.addLoopTrap(branch, block.id) || Blockly.JavaScript.PASS;
  var code = '// element "' + name + '"\n';
  code += 'var element = ' + element + ';\n';
  code += branch;
  code += 'if (element.color || (element.texture && character.texture)) {\n'
  code += Blockly.JavaScript.INDENT + 'character["elements"].push(element);\n';
  code += '}\n'
  return code;
};

Blockly.JavaScript['aruco_element_size'] = function(block) {
  var width = Blockly.JavaScript.getFloatOrVar(block, 'WIDTH') * 10;
  var depth = Blockly.JavaScript.getFloatOrVar(block, 'DEPTH') * 10;
  var height = Blockly.JavaScript.getFloatOrVar(block, 'HEIGHT') * 10;
  var code = '{"width": ' + width + ', "depth": ' + depth + ', "height": ' + height + '}';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['aruco_element_move_by'] = function(block) {
  var x = Blockly.JavaScript.getFloatOrVar(block, 'X') * 10;
  var y = Blockly.JavaScript.getFloatOrVar(block, 'Y') * 10;
  var z = Blockly.JavaScript.getFloatOrVar(block, 'Z') * 10;
  var code = '{"mx": ' + x + ', "my": ' + y + ', "mz": ' + z + '}';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['aruco_angles'] = function(block) {
  var x = Blockly.JavaScript.getFloatOrVar(block, 'X');
  var y = Blockly.JavaScript.getFloatOrVar(block, 'Y');
  var z = Blockly.JavaScript.getFloatOrVar(block, 'Z');
  var code = '{"mx": ' + x + ', "my": ' + y + ', "mz": ' + z + '}';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['aruco_element_color'] = function(block) {
  if (!Blockly.JavaScript.hasParent(block, 'aruco_element')) {
    return '';
  }
  var color = Blockly.JavaScript.valueToCode(block, 'COLOR', Blockly.JavaScript.ORDER_NONE);
  var code = 'element["color"] = ' + color + ';\n';
  return code;
};

Blockly.JavaScript['aruco_element_texture'] = function(block) {
  if (!Blockly.JavaScript.hasParent(block, 'aruco_element')) {
    return '';
  }
  var left = Blockly.JavaScript.valueToCode(block, 'LEFT', Blockly.JavaScript.ORDER_NONE);
  var front = Blockly.JavaScript.valueToCode(block, 'FRONT', Blockly.JavaScript.ORDER_NONE);
  var right = Blockly.JavaScript.valueToCode(block, 'RIGHT', Blockly.JavaScript.ORDER_NONE);
  var back = Blockly.JavaScript.valueToCode(block, 'BACK', Blockly.JavaScript.ORDER_NONE);
  var top = Blockly.JavaScript.valueToCode(block, 'TOP', Blockly.JavaScript.ORDER_NONE);
  var bottom = Blockly.JavaScript.valueToCode(block, 'BOTTOM', Blockly.JavaScript.ORDER_NONE);
  var params = '{\n';
  params += Blockly.JavaScript.INDENT + '"left": ' + left + ',\n';
  params += Blockly.JavaScript.INDENT + '"front": ' + front + ',\n';
  params += Blockly.JavaScript.INDENT + '"right": ' + right + ',\n';
  params += Blockly.JavaScript.INDENT + '"back": ' + back + ',\n';
  params += Blockly.JavaScript.INDENT + '"top": ' + top + ',\n';
  params += Blockly.JavaScript.INDENT + '"bottom": ' + bottom + '\n';
  params += '}';
  var code = 'element["texture"] = ' + params + ';\n';
  return code;
};

Blockly.JavaScript['aruco_element_texture_params'] = function(block) {
  var x1 = Blockly.JavaScript.getIntOrVar(block, 'X1');
  var y1 = Blockly.JavaScript.getIntOrVar(block, 'Y1');
  var x2 = Blockly.JavaScript.getIntOrVar(block, 'X2');
  var y2 = Blockly.JavaScript.getIntOrVar(block, 'Y2');
  var mirrored = block.getFieldValue('MIRRORED') === 'TRUE';
  var code = '{"x1": ' + x1 + ', "y1": ' + y1 + ', "x2": ' + x2 + ', "y2": ' + y2 + ', "mirrored": ' + mirrored + '}';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


///// UTILS ///////

function hasCharParent(block) {
  return (Blockly.JavaScript.hasParent(block, 'aruco_character') || Blockly.JavaScript.hasParent(block, 'aruco_character_static'));
}