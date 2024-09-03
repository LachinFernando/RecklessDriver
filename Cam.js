import React, {useEffect} from 'react';
import {useState, useRef} from 'react';
import {Button, StatusBar, StyleSheet, Text, View} from 'react-native';
import {
  useCameraPermission,
  useCameraDevice,
  Camera,
} from 'react-native-vision-camera';
import {urltoBlob} from 'image-conversion';

import {getLiveDetection} from './api/predictionEndpoint';
import {convertFileToBase64} from './Utils/encodingUtils';
import AlertDialog from './Components/AlertDialog';

const SUCCESSFUL_MESSAGE = 'Success';
const UNSUCCESSFUL_MESSAGE = 'Unuccess';
const START_PROCESS = 'Start';
const STOP_PROCESS = 'Stop';
const CONVERSION_ERROR = 'Error Occured Processing Image!';
const PREDICTION_ERROR = 'Error Occured While Predicting!';
const COMMON_ERROR = 'Error Occured';
const MAIN_LABEL = 'label';
const POLL_INTERVAL_SECONDS = 1;

const Cam = () => {
  const camera = useRef(null);
  const {hasPermission, requestPermission} = useCameraPermission();
  const device = useCameraDevice('front');
  const [process, setProcess] = useState(false);
  const [message, setMessage] = useState('');
  const [codeError, setCodeError] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const buttonOnPress = () => {
    setProcess((val) => !val);
  };

  const handlePolling = async () => {
    await new Promise((resolve) =>
      setTimeout(resolve, POLL_INTERVAL_SECONDS * 1000),
    );
    return setRefresh((val) => !val);
  };

  useEffect(() => {
    const getPredictionsEndpoint = async imageSavedPath => {
      const photoUri = `file://${imageSavedPath}`;
      try {
        // Convert the photoUri to Blob
        const blob = await urltoBlob(photoUri);

        // Convert Blob to a pseudo-File object
        const newFile = new File([blob], 'captured_image.jpg', {
          type: blob.type,
          lastModified: Date.now(),
        });
        const {type} = newFile;

        const image = await convertFileToBase64(newFile);
        if (!image) {
          setMessage(CONVERSION_ERROR);
          return null;
        }
        //changing
        const res = await getLiveDetection({image, type});
        if (!res) {
          setMessage(PREDICTION_ERROR);
          return null;
        }
        console.log('Response', res.prediction);
        return res.prediction;
        // Example: Use the File object as needed
      } catch (error) {
        console.error('Error converting URL to Blob:', error);
        setMessage(COMMON_ERROR);
        return null;
      }
    };
    const capturePhoto = async () => {
      if (camera.current !== null) {
        const photo = await camera.current.takePhoto();
        console.log(photo.path);
        const predResponse = await getPredictionsEndpoint(photo.path);
        console.log('pred response', predResponse);
        return predResponse;
      }
    };

    if (process) {
      capturePhoto().then((finalResponse) => {
        if (!finalResponse) {
          if (process) {
            setProcess(false);
          }
          setCodeError(true);
        } else {
          if(finalResponse === MAIN_LABEL){
            console.log('Alert');
          } else {
            handlePolling();
          }
        }
      });
    }
    return () => clearTimeout(capturePhoto);
  }, [process, refresh]);

  return (
    <View style={styles.container}>
      {hasPermission ? (
        <>
          {!codeError && (
            <>
              <Camera
                style={StyleSheet.absoluteFill}
                ref={camera}
                device={device}
                isActive={true}
                photo={true}
              />
            </>
          )}
          {codeError && (
            <View style={styles.container}>
              <Text style={styles.item}>{message}</Text>
              <AlertDialog title="Error" errorMessage={message} />
            </View>
          )}
          <View style={styles.buttonContainer}>
            <Button
              title={process ? STOP_PROCESS : START_PROCESS}
              onPress={buttonOnPress}
            />
          </View>
        </>
      ) : (
        <>
          <Text style={styles.item}>Try permissions</Text>
          <Button title="request permissions" onPress={requestPermission} />
          <Text style={styles.item}>
            {hasPermission ? SUCCESSFUL_MESSAGE : UNSUCCESSFUL_MESSAGE}
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  item: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'red',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});

export default Cam;
