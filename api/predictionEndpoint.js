import {api} from '../Utils/apiUtils';
import {PREDICTION_ENCPOINT} from '../Constants/apiConstants';

export const getLiveDetection = async ({image, type}) => {
  try {
    const res = await api.post(PREDICTION_ENCPOINT, image, {
      'Content-Type': type,
    });
    const { data } = res;
    const { 'predicted_label': prediction } = data;
    return {
      prediction,
    };
  } catch (error) {
    console.log(error.toString());
    return null;
  }
};
