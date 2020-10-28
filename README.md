# Math Garden
This project is a website that uses a trained machine learning model to predict the handwritten input. 

Demo: https://ibrahim1023.github.io/mathgarden/

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Dataset](#dataset)
* [Features](#features)
* [Model](#model)
* [Dependencies](#dependencies)

## General info
The website incorporates a handwritten canvas to allow the user to draw the correct number which becomes an input for the ML model to predict. 

## Technologies
* HTML/CSS
* Javascript

## Dataset
The original data is from the [MNIST database of handwritten digits](http://yann.lecun.com/exdb/mnist/). It is a subset of a larger set available from NIST. The digits have been size-normalized and centered in a fixed-size image.

### Features

The MNIST training set is composed of 30,000 patterns from NIST's Special Database 3 and 30,000 patterns from Special Database 1. Our test set was composed of 5,000 patterns from SD-3 and 5,000 patterns from SD-1. The 60,000 pattern training set contained examples from approximately 250 writers.

The labels range from 0 to 9 making the total no. of classes for the neural network to predict equal to 10. 

## Input Preprocessing
After the input is drawn on the canvas,

1. It converts that drawing to an Image.
2. Removes the RGB channels from the image (basically makes the image Gray scale).
3. Analyses the contours of the image (for object detection).
4. Calculates the shape around the object (mostly its a rectangle).
5. Crops the rest of the image (keeping only the relevant part of the image).
6. Calculates new size (as this image is going to be a test input for the model to predict).
7. Resizes the image to 28x28 (the test size requirement).
8. Finds the centre of the mass to then Shift the image so if you draw on the top left of the canvas or anywhere on the canvas, it'll always transform the image to **center** for prediction.
9. Finally, the image is passed to the trained **Neural Network** model.
10. It predicts and if the answer is correct and model predicted correct too, the background starts to bloom!

**Drawing** an incorrect answer will make the background wither.

**Drawing** 6 correct values consecutively and it comes to an end

## Model

| Model | Accuracy (Highest achieved) |
| :---  |     :---:      |
| `Neural Network` | 97.7 %|

## Dependencies
* Numpy
* TensorFlow
