class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Component Error:', error, info);
  }

  render() {
    return this.state.hasError 
      ? <div className={styles.error}>Ошибка устройства</div>
      : this.props.children;
  }
}