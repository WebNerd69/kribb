import { View, ViewProps, useColorScheme } from 'react-native'

export function ThemedView(props: ViewProps) {
  const theme = useColorScheme()

  const backgroundColor = theme === 'dark' ? '#121212' : '#ffffff'

  return (
    <View
      {...props}
      style={[
        { backgroundColor },
        props.style,
      ]}
    />
  )
}