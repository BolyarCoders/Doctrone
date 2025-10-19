import { useFolders } from '@/hooks/getFolders';
import { router, Stack } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.8;

export default function RootLayout() {
  const { folders, loading, error, refetch } = useFolders();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarAnimation = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  function formatTimeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return `${Math.floor(diff / 604800)} week(s) ago`;
  }

  const toggleSidebar = () => {
    const toValue = isSidebarOpen ? -SIDEBAR_WIDTH : 0;
    
    Animated.spring(sidebarAnimation, {
      toValue,
      useNativeDriver: true,
      tension: 65,
      friction: 9,
    }).start();
    
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Refresh folders when sidebar opens
  const handleSidebarOpen = () => {
    if (!isSidebarOpen) {
      refetch(); // Refresh folders when opening sidebar
    }
    toggleSidebar();
  };

  const FolderIcon = ({ size = 22, color = "#13A77C" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ marginRight: 12 }}>
      <Path
        d="M3 6C3 4.89543 3.89543 4 5 4H9.58579C9.851 4 10.1054 4.10536 10.2929 4.29289L12 6H19C20.1046 6 21 6.89543 21 8V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6Z"
        fill={color}
        fillOpacity="0.1"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {/* Sidebar */}
        <Animated.View 
          style={[
            styles.sidebar,
            {
              transform: [{ translateX: sidebarAnimation }],
            },
          ]}
        >
          <SafeAreaView style={styles.sidebarSafeArea} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View style={styles.sidebarHeader}>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image 
                    source={require('../../assets/images/doctrone-logo.png')} 
                    style={{ width: 50, height: 50, marginBottom: 8 }} 
                  />
                  <Text style={styles.sidebarTitle}>Doctrone</Text>
                </View>
                <Text style={styles.sidebarSubtitle}>AI Health Assistant</Text>
              </View>
              <TouchableOpacity onPress={toggleSidebar} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.sidebarContent}
              showsVerticalScrollIndicator={false}
              bounces={true}
            >
              {/* All Prescriptions Section */}
              <View style={styles.allPrescriptionsSection}>
                <Text style={styles.allPrescriptionsTitle}>All Prescriptions</Text>
                <Text style={styles.allPrescriptionsSubtitle}>
                  Ask questions about all your medications
                </Text>
                <TouchableOpacity 
                  style={styles.allPrescriptionsButton} 
                  onPress={() => {
                    router.navigate('/(tabs)/home');
                    toggleSidebar();
                  }}
                >
                  <Text style={styles.allPrescriptionsButtonText}>💬 Start Conversation</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              {/* Individual Prescriptions Section */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Individual Prescriptions</Text>
                <TouchableOpacity 
                  onPress={() => {
                    router.push('/login/optionsRegister');
                    toggleSidebar();
                  }} 
                  style={styles.addButtonContainer}
                >
                  <Text style={styles.addButton}>+</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionDescription}>
                Ask questions about specific medications
              </Text>

              <View style={styles.prescriptionsContainer}>
                {loading && (
                  <Text style={styles.loadingText}>Loading folders...</Text>
                )}
                
                {error && (
                  <Text style={styles.errorText}>{error}</Text>
                )}
                
                {!loading && !error && folders.length === 0 && (
                  <Text style={styles.emptyText}>
                    No prescriptions yet. Add one to get started!
                  </Text>
                )}
                
                {!loading && !error && folders.map(folder => (
                  <TouchableOpacity
                    key={folder.id}
                    onPress={() => {
                      // Navigate with folder data
                      router.push({
                        pathname: '/(tabs)/activePrescription',
                        params: { 
                          folderId: folder.id, 
                          folderName: folder.name 
                        }
                      });
                      toggleSidebar();
                    }}
                    style={styles.prescriptionItem}
                  >
                    <FolderIcon />
                    <View style={styles.prescriptionTextContainer}>
                      <Text style={styles.prescriptionName}>{folder.name}</Text>
                      <Text style={styles.prescriptionTime}>
                        {formatTimeAgo(folder.created_at)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.divider} />
              
              {/* History Section */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>History</Text>
              </View>

              <TouchableOpacity style={styles.historyItem}>
                <Text style={styles.historyItemText}>View all prescriptions</Text>
                <Text style={styles.arrow}>→</Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Footer */}
            <View style={styles.sidebarFooter}>
              <TouchableOpacity style={styles.footerButton}>
                <Text style={styles.footerButtonText}>⚙️ Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerButton}>
                <Text style={styles.footerButtonText}>❓ Help & Support</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>

        {/* Overlay */}
        {isSidebarOpen && (
          <TouchableOpacity 
            style={styles.overlay} 
            activeOpacity={1} 
            onPress={toggleSidebar}
          />
        )}

        {/* Main Content */}
        <Stack
          screenOptions={{
            headerShown: true,
            headerTransparent: true, 
            headerStyle: {
              backgroundColor: 'transparent',
            },
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: '700',
              color: '#fff',
            },
            headerLeft: () => (
              <TouchableOpacity onPress={handleSidebarOpen} style={styles.menuButton}>
                <View style={styles.menuIconContainer}>
                  <View style={styles.menuLine} />
                  <View style={styles.menuLine} />
                  <View style={styles.menuLine} />
                </View>
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity onPress={() => {}} style={styles.profileButton}>
                <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                  <Circle cx="12" cy="8" r="4" stroke="#fff" strokeWidth={2} />
                  <Path
                    d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20"
                    stroke="#fff"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                </Svg>
              </TouchableOpacity>
            ),
            headerTitle: 'Doctrone AI',
            headerTitleAlign: 'center',
          }}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  menuLine: {
    width: '100%',
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#FFFFFF',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
  },
  sidebarSafeArea: {
    flex: 1,
  },
  sidebarHeader: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#13A77C',
  },
  sidebarTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  sidebarSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
    letterSpacing: 0.3,
  },
  closeButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 18,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '300',
  },
  sidebarContent: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 20,
  },
  allPrescriptionsSection: {
    marginHorizontal: 16,
    padding: 20,
    backgroundColor: '#F0F9F6',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#13A77C',
  },
  allPrescriptionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#13A77C',
    marginBottom: 6,
  },
  allPrescriptionsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 14,
    lineHeight: 20,
  },
  allPrescriptionsButton: {
    backgroundColor: '#13A77C',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#13A77C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  allPrescriptionsButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionDescription: {
    fontSize: 13,
    color: '#9CA3AF',
    paddingHorizontal: 20,
    paddingBottom: 8,
    fontStyle: 'italic',
  },
  addButtonContainer: {
    width: 28,
    height: 28,
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    fontSize: 20,
    color: '#13A77C',
    fontWeight: '400',
  },
  prescriptionsContainer: {
    paddingHorizontal: 12,
    paddingTop: 4,
  },
  prescriptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginVertical: 4,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  prescriptionTextContainer: {
    flex: 1,
  },
  prescriptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  prescriptionTime: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  loadingText: {
    padding: 16,
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
  },
  errorText: {
    padding: 16,
    textAlign: 'center',
    color: '#EF4444',
    fontSize: 14,
  },
  emptyText: {
    padding: 16,
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 14,
    fontStyle: 'italic',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 12,
    marginBottom: 50,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
  },
  historyItemText: {
    fontSize: 15,
    color: '#4B5563',
    fontWeight: '500',
  },
  arrow: {
    fontSize: 18,
    color: '#9CA3AF',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
    marginHorizontal: 20,
  },
  sidebarFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  footerButton: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  footerButtonText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 999,
  },
  profileButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});