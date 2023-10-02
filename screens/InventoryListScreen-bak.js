import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, RefreshControl, ScrollView, TextInput, Dimensions } from 'react-native';
import { DataTable, Button, Dialog, Portal, Paragraph } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

class InventoryListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      posts: [],
      isConnected: true,
      isRefreshing: false,
      searchQuery: '',
      itemsPerPage: 15, // Set the number of items per page
      showDeleteDialog: false,
      showMessageDialog: false,
      dialogPost: null,
      showDuplicateDialog: false,
      message: '',
      messageTitle: '',
    };
  }

  componentDidMount() {
    console.log('loaded');
    this.fetchPosts();
    this.unsubscribe = NetInfo.addEventListener(this.handleConnectivityChange);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleConnectivityChange = (connectionInfo) => {
    const isConnected = connectionInfo.isConnected;
    this.setState({ isConnected });

    if (isConnected) {
      // this.fetchPosts();
      this.fetchPosts();
    } else {
      this.loadStoredPosts();
    }
  };

  fetchPosts = () => {
    const wordpressApiUrl = 'https://valiantservices.dcodeprojects.co.in/wp-json/sections/v1/specification_sheet/';

    axios
    .get(wordpressApiUrl)
    .then((response) => {
      const posts = response.data;
      console.log(posts);
      this.setState({ posts: JSON.parse(posts)  });
      // AsyncStorage.setItem('posts', posts)
      //   .then(() => {
      //     this.setState({ posts: JSON.parse(posts)  });
      //   })
      //   .catch((error) => {
      //     console.error('Error saving posts:', error);
      //     // Display an error message to the user
      //   });
    })
    .catch((error) => {
      console.error('Error fetching posts:', error);
      // Handle the fetch error
    });
  };

  loadStoredPosts = () => {
    
    AsyncStorage.getItem('posts')
      .then((storedPosts) => {

        if (storedPosts) {

          this.setState({ posts: JSON.parse(storedPosts) });
        }
      })
      .catch((error) => {
        console.error('Error loading stored posts:', error);
      });
  };

  deletePost = () => {
    const { postToDelete } = this.state;

    this.hideDialog(); // Hide the dialog
  };


  handleRefresh = () => {
    this.setState({ isRefreshing: true });
    this.fetchPosts();
    setTimeout(() => {
      this.setState({ isRefreshing: false });
    }, 1000);
  };

  handleNextPage = () => {
    const { currentPage, posts, itemsPerPage } = this.state;
    const totalPages = Math.ceil(posts.length / itemsPerPage);
    if (currentPage < totalPages) {
      this.setState({ currentPage: currentPage + 1 });
    }
  };

  handlePreviousPage = () => {
    const { currentPage } = this.state;
    if (currentPage > 1) {
      this.setState({ currentPage: currentPage - 1 });
    }
  };

  handleView = (post) => {
    this.props.navigation.navigate('SingleInventory', { post });
  };

  handleEdit = (post) => {
    this.props.navigation.navigate('EditSingleInventory', { post });
  };

  // Function to show the dialog
  showDeleteDialog = (post) => {
    this.setState({ showDeleteDialog: true, dialogPost: post });
  };

  // Function to hide the dialog
  hideDialog = () => {
    this.setState({ showDeleteDialog: false, dialogPost: null });
  };

  // Function to hide the dialog
  hideMessageDialog = () => {
    this.setState({ showMessageDialog: false, dialogPost: null });
  };

  // Function to handle delete
  handleDelete = (post) => {
    this.showDeleteDialog(post); // Show the dialog when Delete is pressed
  };

  handleConfirmDelete = (post) => {
    // Delete the post using post ID
    const deleteApiUrl = `https://valiantservices.dcodeprojects.co.in/wp-json/sections/v1/specification_sheet/delete/${post.ID}`;
    const messageTitle = 'Deletion Message';

    axios
    .get(deleteApiUrl)
    .then((response) => {
      console.log('Post deleted successfully:', response.data);
      this.fetchPosts(); // Fetch updated posts after deletion
      // Set the message
      const message = `${post.post_title} has been deleted successfully.`;
      // Set the message title

      this.setState({
        messageTitle, 
        message,
        showDeleteDialog: false,
        showMessageDialog: true,
        dialogPost: post,
      });
    })
    .catch((error) => {
      console.error('Error deleting post:', error);
      this.hideDialog(); // Close the dialog even on error
    });
  };

  hideDuplicateDialog = () => {
    this.setState({ showDuplicateDialog: false, dialogPost: null });
  };

  handleDuplicate = (post) => {
    this.setState({ showDuplicateDialog: true, dialogPost: post });
  };

  handleConfirmDuplicate = (post) => {
    console.log('Confirmed Duplicate:', post);
    // Implement your logic to duplicate the post here
    const messageTitle = 'Duplicate Message';
    // Set the message
    const message = `${post.post_title} has been duplicated successfully.`;

    const duplicateApiUrl = `https://valiantservices.dcodeprojects.co.in/wp-json/sections/v1/specification_sheet/duplicate/${post.ID}`;

    // Update state and show message dialog
    this.setState({ messageTitle, message, showMessageDialog: true });

    axios
    .get(duplicateApiUrl)
    .then((response) => {
      console.log('Duplicated successfully:', response.data);
      this.fetchPosts(); // Fetch updated posts after deletion
      // Set the message
      const message = `${post.post_title} has been duplicated successfully.`;
      // Set the message title

      this.setState({
        messageTitle, 
        message,
        showDuplicateDialog: false,
        showMessageDialog: true,
        dialogPost: post,
      });
    })
    .catch((error) => {
      console.error('Error duplicating post:', error);
      this.hideDialog(); // Close the dialog even on error
    });

    // Close the duplicate dialog
    this.hideDuplicateDialog();

   
  };

  handleSearch = (query) => {
    const { posts, itemsPerPage } = this.state;
    const filteredPosts = posts.filter((post) =>
      post.post_title.toLowerCase().includes(query.toLowerCase())
    );

    this.setState({
      searchQuery: query,
      currentPage: 1,
      displayedData: filteredPosts.slice(0, itemsPerPage),
    });
  };



  render() {
    const { currentPage, posts, isRefreshing, searchQuery, itemsPerPage } = this.state;

    const filteredPosts = posts.filter((post) =>
      post.post_title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedData = filteredPosts.slice(startIndex, endIndex);
    const { showDialog } = this.state;
    // Function to format the date
    const formatDateTime = (rawDate) => {
      const options = {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false // Use 24-hour format
      };
      return new Date(rawDate).toLocaleString(undefined, options);
    };

    const screenWidth = 1500;

    console.log(screenWidth);
    const columnWidth = screenWidth / 3;

    return (
      <View style={styles.container}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title"
          value={searchQuery}
          onChangeText={this.handleSearch}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={this.fetchPosts} />}

        />
        <ScrollView
          style={styles.dataTableContainer}
          horizontal
          showsHorizontalScrollIndicator={true}
        >
          <ScrollView vertical showsVerticalScrollIndicator={true} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={this.fetchPosts} />}
>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title style={[styles.columnTitle, { width: columnWidth }]}>RPIE Index #</DataTable.Title>
                <DataTable.Title style={[styles.columnTitle, { width: columnWidth }]}>Created Date</DataTable.Title>
                <DataTable.Title style={[styles.columnTitle, { width: columnWidth }]}>Status</DataTable.Title>
                <DataTable.Title style={[styles.actionColumnTitle, { width: columnWidth }]}>Action</DataTable.Title>
              </DataTable.Header>

              {displayedData.map((post, postIndex) => (
                <DataTable.Row key={postIndex}>
                  <DataTable.Cell style={[styles.column, { width: columnWidth }]}>
                    <Text style={styles.cellText}>{post.post_title}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={[styles.column, { width: columnWidth }]}>
                    <Text style={styles.cellText}>{formatDateTime(post.post_date)}</Text>
                  </DataTable.Cell>


                  <DataTable.Cell style={[styles.column, { width: columnWidth }]}>
                    {post.acf.status?.value === 'none' ? (
                      <Text style={styles.cellText}></Text>
                    ) : (
                      <Text style={styles.cellText}>{post.acf.status?.label}</Text>
                    )}
                  </DataTable.Cell>
                  <DataTable.Cell style={[styles.actionColumn, { width: columnWidth }]}>
                    <Button icon="eye" onPress={() => this.handleView(post)}>
                      View
                    </Button>
                    <Button icon="pencil" onPress={() => this.handleEdit(post)}>
                      Edit
                    </Button>
                    <Button icon="delete" onPress={() => this.handleDelete(post)}>
                      Delete
                    </Button>
                    <Button icon="content-duplicate" onPress={() => this.handleDuplicate(post)}>
                      Duplicate
                    </Button>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </ScrollView>
        </ScrollView>

        <View style={styles.pagination}>
          <TouchableOpacity onPress={this.handlePreviousPage} disabled={currentPage === 1}>
            <Text style={styles.paginationText}>Previous</Text>
          </TouchableOpacity>
          <Text style={styles.paginationText}>
            Page {currentPage} of {totalPages}
          </Text>
          <TouchableOpacity onPress={this.handleNextPage} disabled={currentPage === totalPages}>
            <Text style={styles.paginationText}>Next</Text>
          </TouchableOpacity>
        </View>

        {/* Render the Dialog component */}
        <Portal>
          <Dialog visible={this.state.showDeleteDialog} onDismiss={this.hideDialog}>
            <Dialog.Title>Confirm Deletion</Dialog.Title>
            <Dialog.Content>
              <Paragraph>
                Are you sure you want to delete {this.state.dialogPost?.post_title}?
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={this.hideDialog}>Cancel</Button>
              <Button onPress={() => this.handleConfirmDelete(this.state.dialogPost)}>Delete</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Portal>
          <Dialog visible={this.state.showMessageDialog} onDismiss={this.hideMessageDialog}>
            <Dialog.Title>{this.state.messageTitle}</Dialog.Title>
            <Dialog.Content>
              <Paragraph>{this.state.message}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={this.hideMessageDialog}>OK</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        {/* Render the Duplicate Confirmation Dialog */}
        <Portal>
          <Dialog visible={this.state.showDuplicateDialog} onDismiss={this.hideDuplicateDialog}>
            <Dialog.Title>Confirm Duplicate</Dialog.Title>
            <Dialog.Content>
              <Paragraph>
                Are you sure you want to duplicate {this.state.dialogPost?.post_title}?
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={this.hideDuplicateDialog}>Cancel</Button>
              <Button onPress={() => this.handleConfirmDuplicate(this.state.dialogPost)}>Duplicate</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  dataTableContainer: {
    flex: 1,
  },
  columnTitle: {
    flex: 1, // Use flex for dynamic width
  },
  column: {
    flex: 1, // Use flex for dynamic width
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
    width: '33%'
  },
  cellText: {
    flexWrap: 'wrap',
    maxWidth: '100%',
  },
  actionColumnTitle: {
    width: 200, // Set a fixed width for the action column
  },
  actionColumn: {
    width: 200, // Set a fixed width for the action column
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
  },
  searchInput: {
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  paginationText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
});

export default InventoryListScreen;
