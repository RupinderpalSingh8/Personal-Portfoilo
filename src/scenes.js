import hero from '../Assets/hero-banner.jpg'
import digitsImg from '../Assets/hwd.jpg'
import bankImg from '../Assets/bank.jpeg'
import mangonelImg from '../Assets/mangonel.jpeg'
import buggyImg from '../Assets/buggy.jpeg'
import ijcs from '../Assets/infant-jesus-convent-school-mohali-logo.jpg'
import mount from '../Assets/mount .jpg'
import tiet from '../Assets/Picsart_22-03-11_19-29-27-703.png'

/**
 * Camera order. Facts are taken from the live page only.
 *
 * Newer work: insert a station in this array (before contact).
 * The path, the reading page, and the station rail all follow this list.
 *
 * Work stations use lines labelled Situation, Constraint, Built, Changed.
 * images: [{ src, alt, matte? }]
 * marker: 'frame' or 'lamp' when a station has no image.
 */

export const links = {
  resume: {
    href: 'https://drive.google.com/file/d/1pO40q9-Zw63SJ8Eo5Si872l1wUmGRLEF/view?usp=sharing',
    label: 'Resume',
    external: true,
  },
  linkedin: {
    href: 'https://www.linkedin.com/in/rupinderpal-singh-98a203288/',
    label: 'LinkedIn',
    external: true,
  },
  github: {
    href: 'https://github.com/RupinderpalSingh8',
    label: 'GitHub',
    external: true,
  },
  phone: {
    href: 'tel:+919463233432',
    label: '+91 94632 33432',
  },
  email: {
    href: 'mailto:rupinderpalsingh022@gmail.com',
    label: 'rupinderpalsingh022@gmail.com',
  },
}

export const scenes = [
  {
    id: 'arrival',
    nav: 'Arrival',
    kicker: 'TIET, Patiala',
    title: 'Rupinderpal Singh',
    lede: 'Developer and computer engineer.',
    hint: 'Scroll to move through the room.',
    images: [
      {
        src: hero,
        alt: 'Rupinderpal Singh standing outside with his arms crossed.',
      },
    ],
  },
  {
    id: 'record',
    nav: 'Record',
    kicker: 'On this site',
    title: 'Four projects and an internship.',
    lede: 'Handwritten digits, a banking database, a precision mangonel, an automated buggy, and computer-vision work at Egis Engineering. Education is listed after the projects and the internship.',
    images: [],
    marker: 'frame',
  },
  {
    id: 'digits',
    nav: 'Digits',
    kicker: 'Project',
    title: 'Hand Digit Recognition',
    lines: [
      {
        label: 'Situation',
        text: 'A large set of handwritten digits, with training samples and testing samples.',
      },
      {
        label: 'Constraint',
        text: 'Recognize hand-drawn digits from 0 to 9.',
      },
      {
        label: 'Built',
        text: 'A model trained on that set of handwritten digits.',
      },
      {
        label: 'Changed',
        text: 'The model recognizes hand-drawn digits from 0 to 9.',
      },
    ],
    images: [
      {
        src: digitsImg,
        alt: 'Handwritten digits with detection boxes on the left and rows of digits on the right.',
      },
    ],
  },
  {
    id: 'bank',
    nav: 'Banking',
    kicker: 'Project',
    title: 'DBMS Banking Database',
    lines: [
      {
        label: 'Situation',
        text: 'Banking data to organize in a relational database.',
      },
      {
        label: 'Constraint',
        text: 'Oracle Database, SQL queries, and normalization.',
      },
      {
        label: 'Built',
        text: 'A banking database in relational tables.',
      },
      {
        label: 'Changed',
        text: 'Hands-on work organizing and managing data in a relational database.',
      },
    ],
    images: [
      {
        src: bankImg,
        alt: 'A banking system form with customer fields and account controls.',
      },
    ],
  },
  {
    id: 'mangonel',
    nav: 'Mangonel',
    kicker: 'Project',
    title: 'Precision Mangonel',
    lines: [
      {
        label: 'Situation',
        text: 'A semester-long group project.',
      },
      {
        label: 'Constraint',
        text: 'Computer, electronics, and mechanical work in one build.',
      },
      {
        label: 'Built',
        text: 'A precision mangonel.',
      },
      {
        label: 'Changed',
        text: 'The group built the mangonel and produced a result.',
      },
    ],
    images: [
      {
        src: mangonelImg,
        alt: 'A wooden mangonel model with an arm, a sling, and a braced frame.',
        matte: true,
      },
    ],
  },
  {
    id: 'buggy',
    nav: 'Buggy',
    kicker: 'Project',
    title: 'Automated Buggy',
    lines: [
      {
        label: 'Situation',
        text: 'A semester-long project with three challenges.',
      },
      {
        label: 'Constraint',
        text: 'Move a buggy on a black line, stop at set points, and control it from an online server.',
      },
      {
        label: 'Built',
        text: 'An automated buggy.',
      },
      {
        label: 'Changed',
        text: 'The project took on the line, the stops, and server control.',
      },
    ],
    images: [
      {
        src: buggyImg,
        alt: 'A small round buggy with an exposed circuit board on a marked floor, next to a Thapar University banner.',
      },
    ],
  },
  {
    id: 'egis',
    nav: 'Egis',
    kicker: 'Intern, Dec 2022 – Jan 2023',
    title: 'Egis Engineering',
    lines: [
      {
        label: 'Situation',
        text: 'An existing computer-vision model, and text in images that had to be written out as data.',
      },
      {
        label: 'Constraint',
        text: 'OpenCV and TensorFlow.',
      },
      {
        label: 'Built',
        text: 'Optimization of the existing model, and extraction of text into a CSV file.',
      },
      {
        label: 'Changed',
        text: '10 percent accuracy improvement on the existing model. Text data converted to a CSV file for analysis.',
      },
    ],
    images: [],
    marker: 'frame',
  },
  {
    id: 'schools',
    nav: 'Schools',
    kicker: 'Education',
    title: 'Schools',
    schools: [
      {
        src: ijcs,
        alt: 'Crest of Infant Jesus Convent School.',
        name: 'Infant Jesus Convent School',
        meta: 'Mohali, 2017',
      },
      {
        src: mount,
        alt: 'Crest of Mount Carmel School.',
        name: 'Mount Carmel School',
        meta: 'Chandigarh, 2019',
      },
      {
        src: tiet,
        alt: 'Mark of Thapar Institute of Engineering and Technology.',
        name: 'TIET, Patiala',
        meta: '2020–2024',
      },
    ],
    images: [
      {
        src: ijcs,
        alt: 'Crest of Infant Jesus Convent School.',
        matte: true,
      },
      {
        src: mount,
        alt: 'Crest of Mount Carmel School.',
        matte: true,
      },
      {
        src: tiet,
        alt: 'Mark of Thapar Institute of Engineering and Technology.',
        matte: true,
      },
    ],
  },
  {
    id: 'contact',
    nav: 'Contact',
    kicker: 'Reach me',
    title: 'Contact',
    lede: 'Developer and computer engineer at TIET, Patiala.',
    closing: 'Developer. Computer engineer.',
    images: [],
    marker: 'lamp',
    contact: true,
  },
]
