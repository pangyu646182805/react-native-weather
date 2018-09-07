import Toast from 'react-native-simple-toast';

export default class ToastUtils {
    static show(message, duration = Toast.SHORT) {
        Toast.show(message, duration);
    }

    static showWithGravity(message, duration = Toast.SHORT, gravity = Toast.BOTTOM) {
        Toast.showWithGravity(message, duration, gravity);
    }
}
