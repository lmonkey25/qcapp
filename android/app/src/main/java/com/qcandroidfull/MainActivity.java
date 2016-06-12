package com.qcandroidfull;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;
import android.app.Activity;

import android.content.Intent;     // <--- import
import android.os.Bundle;

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;

import com.facebook.appevents.AppEventsLogger;
import co.apptailor.googlesignin.RNGoogleSigninModule; 
import co.apptailor.googlesignin.RNGoogleSigninPackage;

import com.rhaker.reactnativesmsandroid.RNSmsAndroidPackage; 
import com.mapbox.reactnativemapboxgl.ReactNativeMapboxGLPackage;
import com.imagepicker.ImagePickerPackage;
import com.yoloci.fileupload.FileUploadPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import cl.json.RNSharePackage;
import com.chymtt.reactnativedropdown.DropdownPackage;

public class MainActivity extends ReactActivity {

    CallbackManager mCallbackManager;

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "QCAndroidFull";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        mCallbackManager = new CallbackManager.Factory().create();

        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new FBSDKPackage(mCallbackManager),
            new RNGoogleSigninPackage(),
            new RNSmsAndroidPackage(this),
            new ReactNativeMapboxGLPackage(),
            new ImagePickerPackage(),
            new FileUploadPackage(),
            new ReactVideoPackage(),
            new ReactNativeContacts(),
            new ReactNativeLocalizationPackage(),
            new VectorIconsPackage(),
            new RNSharePackage(),
            new DropdownPackage()
        );
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //getWindow().getDecorView().setLayoutDirection(View.LAYOUT_DIRECTION_RTL);
        FacebookSdk.sdkInitialize(getApplicationContext());
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {

        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == RNGoogleSigninModule.RC_SIGN_IN) {
            //RNGoogleSigninModule.onActivityResult(data);

            //GoogleSignInResult result = Auth.GoogleSignInApi.getSignInResultFromIntent(data);
            //handleSignInResult(result, false);
        }

        mCallbackManager.onActivityResult(requestCode, resultCode, data);
    }
}
