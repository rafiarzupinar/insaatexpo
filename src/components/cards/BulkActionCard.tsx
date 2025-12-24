import React from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { Card, Badge } from '../common';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

interface ActionItem {
  id: string;
  name: string;
  avatar: string;
  issue: string;
  priority: 'high' | 'medium' | 'low';
}

interface BulkActionCardProps {
  items: ActionItem[];
  onPress?: () => void;
}

const BulkActionCard: React.FC<BulkActionCardProps> = ({ items, onPress }) => {
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return { bg: colors.dangerLight, text: colors.danger };
      case 'medium':
        return { bg: colors.orange[100], text: colors.primary };
      case 'low':
        return { bg: colors.gray[100], text: colors.gray[600] };
      default:
        return { bg: colors.gray[100], text: colors.gray[600] };
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
      default:
        return priority;
    }
  };

  const renderItem = ({ item }: { item: ActionItem }) => {
    const priorityStyle = getPriorityStyle(item.priority);

    return (
      <View style={styles.item}>
        <View style={styles.itemLeft}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{item.name}</Text>
        </View>
        <Text style={styles.issue}>{item.issue}</Text>
        <View style={[styles.priorityBadge, { backgroundColor: priorityStyle.bg }]}>
          <Text style={[styles.priorityText, { color: priorityStyle.text }]}>
            {getPriorityLabel(item.priority)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Card onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Bulk Actions</Text>
          <Icon name="info" size={14} color={colors.gray[400]} />
        </View>
        <Icon name="more-horizontal" size={20} color={colors.gray[400]} />
      </View>

      <View style={styles.list}>
        {items.map((item) => (
          <View key={item.id}>
            {renderItem({ item })}
          </View>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: '500',
    color: colors.gray[700],
  },
  list: {
    gap: spacing.lg,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.md,
  },
  name: {
    fontSize: typography.fontSize.base,
    fontWeight: '500',
    color: colors.gray[900],
  },
  issue: {
    fontSize: typography.fontSize.base,
    color: colors.gray[500],
    flex: 1,
    textAlign: 'center',
  },
  priorityBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  priorityText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '500',
  },
});

export default BulkActionCard;
