import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather as Icon } from '@expo/vector-icons';
import { colors, shadows, borderRadius, spacing } from '../constants/theme';

// Screen imports
import DashboardScreen from '../screens/Dashboard';
import ProjectsScreen from '../screens/Projects';
import TasksScreen from '../screens/Tasks';
import FinanceScreen from '../screens/Finance';
import SafetyScreen from '../screens/Safety';
import ReportsScreen from '../screens/Reports';

const Tab = createBottomTabNavigator();

// Custom Tab Bar Component - Dark floating style from design
const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const getIcon = () => {
            switch (route.name) {
              case 'Dashboard':
                return 'home';
              case 'Projects':
                return 'layers';
              case 'Tasks':
                return 'check-square';
              case 'Finance':
                return 'dollar-sign';
              case 'Safety':
                return 'shield';
              case 'Analytics':
                return 'bar-chart-2';
              default:
                return 'circle';
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, isFocused && styles.iconContainerActive]}>
                <Icon
                  name={getIcon()}
                  size={20}
                  color={isFocused ? colors.primary : 'rgba(255,255,255,0.5)'}
                />
              </View>
            </TouchableOpacity>
          );
        })}

        {/* User Avatar at the end */}
        <TouchableOpacity style={styles.avatarButton} activeOpacity={0.7}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80' }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Projects" component={ProjectsScreen} />
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen name="Finance" component={FinanceScreen} />
      <Tab.Screen name="Safety" component={SafetyScreen} />
      <Tab.Screen name="Analytics" component={ReportsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 34 : 24,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    borderRadius: 40,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    alignItems: 'center',
    gap: spacing.xs,
    ...shadows.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  tabButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerActive: {
    backgroundColor: 'rgba(255,127,80,0.15)',
  },
  avatarButton: {
    marginLeft: spacing.xs,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
});

export default BottomTabNavigator;
