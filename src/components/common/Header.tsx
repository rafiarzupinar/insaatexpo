import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showNotification?: boolean;
  showSearch?: boolean;
  showExport?: boolean;
  showAI?: boolean;
  userImage?: string;
  notificationCount?: number;
  onBackPress?: () => void;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
  onExportPress?: () => void;
  onAIPress?: () => void;
  onProfilePress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  showNotification = true,
  userImage,
  onBackPress,
  onNotificationPress,
  onProfilePress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
            <Icon name="chevron-left" size={24} color={colors.gray[700]} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.rightSection}>
        {showNotification && (
          <TouchableOpacity style={styles.iconButton} onPress={onNotificationPress}>
            <Icon name="refresh-cw" size={20} color={colors.gray[500]} />
          </TouchableOpacity>
        )}

        {userImage ? (
          <TouchableOpacity onPress={onProfilePress}>
            <Image source={{ uri: userImage }} style={styles.userImage} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.avatarPlaceholder} onPress={onProfilePress}>
            <Icon name="user" size={20} color={colors.gray[500]} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 0) + spacing.md,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: spacing.sm,
    padding: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: '600',
    color: colors.gray[900],
    letterSpacing: -0.5,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.white,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Header;
