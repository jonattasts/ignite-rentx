import React from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { RectButton, PanGestureHandler } from "react-native-gesture-handler";
import { useTheme } from "styled-components";
import { Ionicons } from "@expo/vector-icons";

interface animationProps {
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
}

export function AnimatedFloatingButton({ onPress, icon }: animationProps) {
  const ButtonAnimated = Animated.createAnimatedComponent(RectButton);
  const theme = useTheme();

  const positionY = useSharedValue(0);
  const positionX = useSharedValue(0);

  const animatedButtonStyleAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            positionY.value,
            [0, 50],
            [0, -50],
            Extrapolate.CLAMP
          ),
        },
        {
          translateX: interpolate(
            positionX.value,
            [0, 50],
            [0, -50],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const onGestureEvent = useAnimatedGestureHandler({
    onStart(event, ctx: any) {
      ctx.positionX = positionX.value;
      ctx.positionY = positionY.value;
    },

    onActive(event, ctx: any) {
      positionX.value = ctx.positionX + event.translationX;
      positionY.value = ctx.positionY + event.translationY;
    },

    onEnd() {
      positionX.value = withSpring(0);
      positionY.value = withSpring(0);
    },
  });

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View
        style={[
          animatedButtonStyleAnimation,
          styles.animatedButton,
          { backgroundColor: theme.colors.main },
        ]}
      >
        <ButtonAnimated onPress={onPress}>
          <Ionicons name={icon} size={32} color={theme.colors.shape} />
        </ButtonAnimated>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  animatedButton: {
    position: "absolute",
    bottom: 13,
    right: 22,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});
