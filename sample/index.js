
// Layout all the videos used for the iVideo experience
let vid1 = {
  uid: 111,
  src: "//download.blender.org/peach/trailer/trailer_400p.ogg"
};

let vid2 = {
  uid: 222,
  src: "//ia802602.us.archive.org/29/items/vai_VAiLiiiR_BC/vai.mp4"
};

let vid3 = {
  uid: 333,
  src: "//ia800300.us.archive.org/6/items/tsunami_phuket/tsunami_phuket_512kb.mp4"
};

let vid4 = {
  uid: 444,
  src: "//ia902604.us.archive.org/10/items/tsunami_patong_beach/tsunami_patong_beach_512kb.mp4"
};

let vid5 = {
  uid: 555,
  src: "//ia802702.us.archive.org/17/items/rhysmatrixeffectpreview/preview_512kb.mp4"
};

let vid6 = {
  uid: 666,
  src: "//ia800502.us.archive.org/7/items/NuclearExplosion/NuclearExplosionwww.keepvid.com_512kb.mp4"
};

let vid7 = {
  uid: 777,
  src: "//vjs.zencdn.net/v/oceans.mp4"
};


// Add video options (decision rules etc)
vid1.options = {
  choices: {
    [vid2.uid]: 'some random video',
    [vid6.uid]: 'destruction',
  },
  fallback: vid2.uid
}

vid3.options = {
  fallback: vid4.uid
}

vid6.options = {
  choices: {
    [vid3.uid]: 'tsunami 1',
    [vid4.uid]: 'tsunami 2',
  },
  fallback: vid3.uid
}

vid7.options = {
  choices: {
    [vid1.uid]: 'go back to the start'
  }
}


// Add all videoItems to the src map
let model = {
  [vid1.uid]: vid1,
  [vid2.uid]: vid2,
  [vid3.uid]: vid3,
  [vid4.uid]: vid4,
  [vid5.uid]: vid5,
  [vid6.uid]: vid6,
  [vid7.uid]: vid7
};

document.getElementById("ivid-sample").setAttribute("model", JSON.stringify(model));
