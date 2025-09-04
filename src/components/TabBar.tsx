import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { TabBarButton } from './TabBarButton';
import { useState } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const [dimensions, setDimensions] = useState({height: 20, width: 100})

  const buttonWidth = dimensions.width / state.routes.length

  const onTabbarLayout = (e:LayoutChangeEvent) => {
    setDimensions({
        height: e.nativeEvent.layout.height,
        width: e.nativeEvent.layout.width,
    })
  }

  const tabPositionX = useSharedValue(0)
  const animatedStyle = useAnimatedStyle(() => {
    return {
        transform: [{translateX: tabPositionX.value}]
    }
  })
  return (
    <View onLayout={onTabbarLayout} style={styles.shadow} className="absolute flex flex-row bottom-14 justify-between items-center bg-[#009cd9] mx-10 rounded-full">
      <Animated.View style={[animatedStyle,{
        position: 'absolute',
        backgroundColor: '#df1b7d',
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#fff',
        marginHorizontal: 16,
        height: dimensions.height - -10,
        width: buttonWidth - 35
      }]}/>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
            tabPositionX.value = withSpring(buttonWidth * index, {duration: 1500})
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
            <TabBarButton
                key={route.name}
                onPress={onPress}
                onLongPress={onLongPress}
                isFocused={isFocused}
                routeName={route.name}
                color={isFocused ? "#df1b7d" : "#fff"}
                label={label as string}
            />
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
    shadow: {
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
    },
  });
  
