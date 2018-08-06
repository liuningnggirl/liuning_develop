import React, { Component } from 'react';
import{ ScrollView, Image, Text, View,StyleSheet } from 'react-native'

export default class IScrolledDownAndWhatHappenedNextShockedMe extends Component {
    render() {
        return(
            <ScrollView>
              <Text style={{fontSize:20}}>Scroll me plz</Text>
              <Image style={styles.imgWidth} source={require('./img/favicon.png')} />
              <Image style={styles.imgWidth} source={require('./img/favicon.png')} />
              <Image style={styles.imgWidth} source={require('./img/favicon.png')} />
              <Image style={styles.imgWidth} source={require('./img/favicon.png')} />
              <Image style={styles.imgWidth} source={require('./img/favicon.png')} />
              <Text style={{fontSize:20}}>If you like</Text>
              <Image style={styles.imgWidth} source={require('./img/favicon.png')} />
              <Image style={styles.imgWidth} source={require('./img/favicon.png')} />
              <Image style={styles.imgWidth} source={require('./img/favicon.png')} />
              <Image style={styles.imgWidth} source={require('./img/favicon.png')} />
              <Image style={styles.imgWidth} source={require('./img/favicon.png')} />
              <Text style={{fontSize:20}}>Scrolling down</Text>
              <Image style={styles.imgWidth} source={require('./img/favicon.png')} />
              <Image style={styles.imgWidth} source={require('./img/favicon.png')} />
              <Image style={styles.imgWidth} source={require('./img/favicon.png')} />
              <Image style={styles.imgWidth} source={require('./img/favicon.png')} />
              <Image style={styles.imgWidth} source={require('./img/favicon.png')} />
              <Text style={{fontSize:20}}>What's the best</Text>
              <Image style={styles.imgWidth} source={require('./img/favicon.png')} />
              <Image style={styles.imgWidth} source={require('./img/favicon.png')} />
              <Image style={styles.imgWidth} source={require('./img/favicon.png')} />
              <Image style={styles.imgWidth} source={require('./img/favicon.png')} />
              <Image style={styles.imgWidth} source={require('./img/favicon.png')} />
              <Text style={{fontSize:20}}>Framework around?</Text>
              <Image style={styles.imgWidth} source={require('./img/favicon.png')} />
              <Image style={styles.imgWidth} source={require('./img/favicon.png')} />
              <Image style={styles.imgWidth} source={require('./img/favicon.png')} />
              <Image style={styles.imgWidth} source={require('./img/favicon.png')} />
              <Image style={styles.imgWidth} source={require('./img/favicon.png')} />
              <Text style={{fontSize:20}}>React Native</Text>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    imgWidth:{
      width:100+'%'
    }
});
