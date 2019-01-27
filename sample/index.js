
/**
 * Layout of all the videos used for the iVid sandbox
 */
let video1 = {
  uid: 111,
  src: "//ia601305.us.archive.org/28/items/arashyekt4_gmail_Cat/Cat.mp4"
};

let video2 = {
  uid: 222,
  src: "//ia902205.us.archive.org/26/items/gregthecatascatcatwmv/cat_512kb.mp4"
};

let video3 = {
  uid: 333,
  src: "//ia800407.us.archive.org/24/items/spam_troic_Cat/cat.ogv"
};

let video4 = {
  uid: 444,
  src: "//ia802801.us.archive.org/3/items/Movie954/movie%20954.mp4"
};

let video5 = {
  uid: 555,
  src: "//ia800207.us.archive.org/33/items/CatTrouble/CatTrouble.mp4"
};

let video6 = {
  uid: 666,
  src: "//ia802605.us.archive.org/33/items/CatDance/KittyCatDance.ogv"
};

let video7 = {
  uid: 777,
  src: "//ia800708.us.archive.org/21/items/youtube-nB5BguHIyXs/Cool_Cat_by_Charlie_Schmidt_s_Keyboard_Cat-nB5BguHIyXs.ogv"
};


/**
 * Add video options "choice-map"
 */

// There's no need to add a fallback attribute...
video1.options = {
  choices: {
    [video2.uid]: 'A cat', // ... the first choice will be the default fallback
    [video3.uid]: 'A troiKat',
    [video6.uid]: 'A kitty cat dance',
  },
}

// The next video can be set directly
video2.options = {
  choices: { // By displaying "choices"... or forcing them through
    [video3.uid]: 'troikating...'
  }
}

video3.options = {
  fallback: video5.uid // Or seamlessly
}


// Or setting everything up, for a better control
video4.options = {
  choices: {
    [video1.uid]: 'Meow',
  },
  fallback: video6.uid
}

video6.options = {
  choices: {
    [video3.uid]: 'The troiKat now?',
    [video4.uid]: 'What?',
  },
  fallback: video2.uid // And more twisted plays
}


/**
 * Create a model object.
 * Each model attribute is a videoUID of value: the video itself
 */
let model = {
  [video1.uid]: video1,
  [video2.uid]: video2,
  [video3.uid]: video3,
  [video4.uid]: video4,
  [video5.uid]: video5,
  [video6.uid]: video6,
  [video7.uid]: video7
};

/**
 * Add model to iVid component (as a JSON string)
 */
document.getElementById("ivid-sample").setAttribute("model", JSON.stringify(model));
