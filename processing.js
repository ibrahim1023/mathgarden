var model;
var image;
var contours;
var hierarchy;
var cnt;
var newSize;
var M;
var pixelValues;

var height = 0;
var width = 0;

async function loadModel() {
  model = await tf.loadGraphModel('./TFJS/model.json');
}

function loadImage() {
  image = cv.imread(canvas);

  // convert image to grayscale
  cv.cvtColor(image, image, cv.COLOR_RGBA2GRAY, 0);
  cv.threshold(image, image, 175, 255, cv.THRESH_BINARY);
}

function findImageContours() {
  // findContours
  contours = new cv.MatVector();
  hierarchy = new cv.Mat();
  // You can try more different parameters
  cv.findContours(
    image,
    contours,
    hierarchy,
    cv.RETR_CCOMP,
    cv.CHAIN_APPROX_SIMPLE
  );

  // bounding rectangle
  cnt = contours.get(0);
  let rect = cv.boundingRect(cnt);
  image = image.roi(rect);
}

function resizeImage() {
  height = image.rows;
  width = image.cols;

  if (height > width) {
    height = 20;
    const scaleFactor = image.rows / height;
    width = Math.round(image.cols / scaleFactor);
  } else {
    width = 20;
    const scaleFactor = image.cols / width;
    height = Math.round(image.rows / scaleFactor);
  }

  newSize = new cv.Size(width, height);
  cv.resize(image, image, newSize, 0, 0, cv.INTER_AREA);
}

function addPaddingToImage() {
  const LEFT = Math.ceil(4 + (20 - width) / 2);
  const RIGHT = Math.floor(4 + (20 - width) / 2);
  const TOP = Math.ceil(4 + (20 - height) / 2);
  const BOTTOM = Math.floor(4 + (20 - height) / 2);

  const BLACK = new cv.Scalar(0, 0, 0, 0);

  cv.copyMakeBorder(
    image,
    image,
    TOP,
    BOTTOM,
    LEFT,
    RIGHT,
    cv.BORDER_CONSTANT,
    BLACK
  );
}

function findCentroid() {
  cv.findContours(
    image,
    contours,
    hierarchy,
    cv.RETR_CCOMP,
    cv.CHAIN_APPROX_SIMPLE
  );

  cnt = contours.get(0);
  const Moments = cv.moments(cnt, false);

  const cx = Moments.m10 / Moments.m00;
  const cy = Moments.m01 / Moments.m00;

  // console.log('M00: ', Moments.m00);
  // console.log('X: ', cx);
  // console.log('Y: ', cy);

  // Shift the image
  const X_SHIFT = Math.round(image.cols / 2.0 - cx);
  const Y_SHIFT = Math.round(image.rows / 2.0 - cy);

  newSize = new cv.Size(image.cols, image.rows);
  M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, X_SHIFT, 0, 1, Y_SHIFT]);

  cv.warpAffine(
    image,
    image,
    M,
    newSize,
    cv.INTER_LINEAR,
    cv.BORDER_CONSTANT,
    new cv.Scalar(0, 0, 0, 0)
  );
}

function findResults() {
  pixelValues = Float32Array.from(image.data);

  pixelValues = pixelValues.map(function (pixel) {
    return pixel / 255.0;
  });

  const myTensor = tf.tensor([pixelValues]);
  // console.log('Shape: ', X.shape);
  // console.log('dtype: ', X.dtype);

  const result = model.predict(myTensor);
  // result.print();

  const output = result.dataSync();
  // console.log('Output:', output[0]);

  cleanUp(result, myTensor);

  return output[0];
}

function predictImage() {
  loadImage();
  findImageContours();
  resizeImage();
  addPaddingToImage();
  findCentroid();

  return findResults();

  // // Testing Only!
  // const outputCanvas = document.createElement('CANVAS');
  // cv.imshow(outputCanvas, image);

  // document.body.appendChild(outputCanvas);
}

function cleanUp(result, myTensor) {
  image.delete();
  contours.delete();
  cnt.delete();
  hierarchy.delete();
  M.delete();
  result.dispose();
  myTensor.dispose();
}
