var teeth = {};

teeth.path = {
  gum: `m -171,208
        c -1,32 57,50 65,12 4,-20 14,-177 106,-177
        C 92,43 102,201 106,221
        c 8,38 66,20 65,-12
        C 171,190 136,0 0,0 -136,0 -171,190 -171,209
        Z`,
  incisor: `M -2,-20
        c -4,2 -25,14 -24,21 1,7 8,10 13,12 5,3 17,13 24,9 7,-4 5,-19 6,-24 1,-5 2,-16 -2,-20 -4,-4 -13,-0 -15,1 z
        M -16,0
        c 3,-3 9,-7 11,-9 3,-2 9,-5 12,-6`,
  canine: `m -20,-20
        c 6,-6 31,-0 38,6 7,7 8,23 -2,33 -10,10 -26,7 -32,0 -6,-6 -11,-34 -5,-38
        z`,
  premolar: `m -2,-30
        c 15,-1 23,8 26,12 3,4 6,10 -1,26
        C 16,24 13,40 -2,39 -17,38 -31,28 -32,15
        c -1,-13 15,-44 30,-45 z
        M -6,-15 c 1,2 4,4 6,5 3,2 10,2 12,1
        M -17,8 c 0,0 9,-1 11,0 4,2 4,6 9,7
        M 1,-9 c 1,13 -7,10 -6,17`,
  molar: `m -9,-30
        c 11,-1 24,3 32,8 7,6 4,23 3,30 -1,7 1,16 -2,24 -3,8 -10,18 -25,18 -15,-1 -19,-7 -24,-11 -5,-4 -4,-24 -3,-36 1,-12 9,-32 20,-33 z
        M -6,-15 c 1,2 4,4 6,5 3,2 10,2 12,1
        M -17,8 c 0,0 9,-1 11,0 4,2 4,6 9,7
        M 1,-9 c 1,13 -7,10 -6,17`,
};

// NOTE: Human children have 2 molars, not premolars. Premolar refers here to the premolar _image_.
teeth.deciduous = [
  { type: 'incisor',  id: '51', pos: [ -23,  16], r: 22 }, // upper left
  { type: 'incisor',  id: '52', pos: [ -65,  33], r: 0  },
  { type: 'canine',   id: '53', pos: [ -93,  65], r: 0  },
  { type: 'premolar', id: '54', pos: [-118, 114], r: 0  },
  { type: 'molar',    id: '55', pos: [-140, 180], r: 0  },
  { type: 'incisor',  id: '61', pos: [  23,  16], r: 22 }, // upper right
  { type: 'incisor',  id: '62', pos: [  65,  33], r: 0  },
  { type: 'canine',   id: '63', pos: [  93,  65], r: 0  },
  { type: 'premolar', id: '64', pos: [ 118, 114], r: 0  },
  { type: 'molar',    id: '65', pos: [ 140, 180], r: 0  },
  { type: 'incisor',  id: '81', pos: [ -23, -16], r: 22 }, // lower left
  { type: 'incisor',  id: '82', pos: [ -65, -33], r: 0  },
  { type: 'canine',   id: '83', pos: [ -93, -65], r: 0  },
  { type: 'premolar', id: '84', pos: [-118,-114], r: 0  },
  { type: 'molar',    id: '85', pos: [-140,-180], r: 0  },
  { type: 'incisor',  id: '71', pos: [  23, -16], r: 22 }, // lower right
  { type: 'incisor',  id: '72', pos: [  65, -33], r: 0  },
  { type: 'canine',   id: '73', pos: [  93, -65], r: 0  },
  { type: 'premolar', id: '74', pos: [ 118,-114], r: 0  },
  { type: 'molar',    id: '75', pos: [ 140,-180], r: 0  },
];
