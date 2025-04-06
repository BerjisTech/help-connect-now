
import { useState } from 'react';
import { ConsultantData, ProfileConfig, PricingModel, FAQItem } from '@/components/interaction/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash, Plus } from 'lucide-react';

interface ConsultantProfileEditorProps {
  consultant: ConsultantData;
  profileConfig: ProfileConfig;
  onSave: (config: ProfileConfig) => void;
  onCancel: () => void;
}

const ConsultantProfileEditor = ({
  consultant,
  profileConfig,
  onSave,
  onCancel
}: ConsultantProfileEditorProps) => {
  const [config, setConfig] = useState<ProfileConfig>({ ...profileConfig });

  const updateHeroConfig = (key: keyof ProfileConfig['heroConfig'], value: any) => {
    setConfig({
      ...config,
      heroConfig: {
        ...config.heroConfig,
        [key]: value
      }
    });
  };

  const updateTrustConfig = (key: keyof ProfileConfig['trustConfig'], value: any) => {
    setConfig({
      ...config,
      trustConfig: {
        ...config.trustConfig,
        [key]: value
      }
    });
  };

  const updateReviewsConfig = (key: keyof ProfileConfig['reviewsConfig'], value: any) => {
    setConfig({
      ...config,
      reviewsConfig: {
        ...config.reviewsConfig,
        [key]: value
      }
    });
  };

  const addPricingModel = () => {
    const newModel: PricingModel = {
      id: Date.now().toString(),
      title: 'New Package',
      price: 0,
      currency: 'USD',
      period: 'per hour',
      features: ['Feature 1'],
      isHighlighted: false
    };

    setConfig({
      ...config,
      pricingConfig: {
        ...config.pricingConfig,
        models: [...config.pricingConfig.models, newModel]
      }
    });
  };

  const updatePricingModel = (index: number, key: keyof PricingModel, value: any) => {
    const updatedModels = [...config.pricingConfig.models];
    updatedModels[index] = {
      ...updatedModels[index],
      [key]: value
    };

    setConfig({
      ...config,
      pricingConfig: {
        ...config.pricingConfig,
        models: updatedModels
      }
    });
  };

  const removePricingModel = (index: number) => {
    const updatedModels = config.pricingConfig.models.filter((_, i) => i !== index);
    setConfig({
      ...config,
      pricingConfig: {
        ...config.pricingConfig,
        models: updatedModels
      }
    });
  };

  const addFeatureToPricingModel = (modelIndex: number) => {
    const updatedModels = [...config.pricingConfig.models];
    updatedModels[modelIndex].features.push('New feature');

    setConfig({
      ...config,
      pricingConfig: {
        ...config.pricingConfig,
        models: updatedModels
      }
    });
  };

  const updateFeatureInPricingModel = (modelIndex: number, featureIndex: number, value: string) => {
    const updatedModels = [...config.pricingConfig.models];
    updatedModels[modelIndex].features[featureIndex] = value;

    setConfig({
      ...config,
      pricingConfig: {
        ...config.pricingConfig,
        models: updatedModels
      }
    });
  };

  const removeFeatureFromPricingModel = (modelIndex: number, featureIndex: number) => {
    const updatedModels = [...config.pricingConfig.models];
    updatedModels[modelIndex].features = updatedModels[modelIndex].features.filter(
      (_, i) => i !== featureIndex
    );

    setConfig({
      ...config,
      pricingConfig: {
        ...config.pricingConfig,
        models: updatedModels
      }
    });
  };

  const addFAQItem = () => {
    const newItem: FAQItem = {
      id: Date.now().toString(),
      question: 'New Question',
      answer: 'Your answer here'
    };

    setConfig({
      ...config,
      faqConfig: {
        ...config.faqConfig,
        questions: [...config.faqConfig.questions, newItem]
      }
    });
  };

  const updateFAQItem = (index: number, key: keyof FAQItem, value: string) => {
    const updatedQuestions = [...config.faqConfig.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [key]: value
    };

    setConfig({
      ...config,
      faqConfig: {
        ...config.faqConfig,
        questions: updatedQuestions
      }
    });
  };

  const removeFAQItem = (index: number) => {
    const updatedQuestions = config.faqConfig.questions.filter((_, i) => i !== index);
    setConfig({
      ...config,
      faqConfig: {
        ...config.faqConfig,
        questions: updatedQuestions
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Your Profile</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => onSave(config)}>
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="hero">
        <TabsList className="mb-6">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="trust">Trust Indicators</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        {/* Hero Section Tab */}
        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="intro">Introduction (Keep it short, 6 words or less)</Label>
                  <Input
                    id="intro"
                    value={config.heroConfig.intro}
                    onChange={(e) => updateHeroConfig('intro', e.target.value)}
                    maxLength={50}
                  />
                </div>
                
                <div>
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={config.heroConfig.tagline}
                    onChange={(e) => updateHeroConfig('tagline', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="bgColor">Background Color</Label>
                  <Input
                    id="bgColor"
                    type="color"
                    value={config.heroConfig.backgroundColor || '#f1f5f9'}
                    onChange={(e) => updateHeroConfig('backgroundColor', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="bgImage">Background Image URL (optional)</Label>
                  <Input
                    id="bgImage"
                    value={config.heroConfig.backgroundImage || ''}
                    onChange={(e) => updateHeroConfig('backgroundImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="showImage"
                    checked={config.heroConfig.showImage}
                    onCheckedChange={(checked) => updateHeroConfig('showImage', checked)}
                  />
                  <Label htmlFor="showImage">Show profile image</Label>
                </div>

                <div>
                  <Label className="block mb-2">Layout</Label>
                  <RadioGroup
                    value={config.heroConfig.layout}
                    onValueChange={(value) => updateHeroConfig('layout', value)}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="left-image" id="left-image" />
                      <Label htmlFor="left-image">Image on left, text on right</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="right-image" id="right-image" />
                      <Label htmlFor="right-image">Image on right, text on left</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="centered" id="centered" />
                      <Label htmlFor="centered">Centered column (image above text)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="block mb-2">Text Alignment</Label>
                  <RadioGroup
                    value={config.heroConfig.textAlignment}
                    onValueChange={(value: 'left' | 'center' | 'right') => updateHeroConfig('textAlignment', value)}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="left" id="text-left" />
                      <Label htmlFor="text-left">Left</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="center" id="text-center" />
                      <Label htmlFor="text-center">Center</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="right" id="text-right" />
                      <Label htmlFor="text-right">Right</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="block mb-2">Tagline Alignment (optional, defaults to text alignment)</Label>
                  <RadioGroup
                    value={config.heroConfig.taglineAlignment || config.heroConfig.textAlignment}
                    onValueChange={(value: 'left' | 'center' | 'right') => updateHeroConfig('taglineAlignment', value)}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="left" id="tagline-left" />
                      <Label htmlFor="tagline-left">Left</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="center" id="tagline-center" />
                      <Label htmlFor="tagline-center">Center</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="right" id="tagline-right" />
                      <Label htmlFor="tagline-right">Right</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trust Indicators Tab */}
        <TabsContent value="trust" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trust Indicators</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="showTrustIndicators"
                  checked={config.trustConfig.showTrustIndicators}
                  onCheckedChange={(checked) => updateTrustConfig('showTrustIndicators', checked)}
                />
                <Label htmlFor="showTrustIndicators">Show trust indicators</Label>
              </div>
              
              {config.trustConfig.showTrustIndicators && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyClients">Number of company clients</Label>
                    <Input
                      id="companyClients"
                      type="number"
                      min="0"
                      value={config.trustConfig.companyClients || 0}
                      onChange={(e) => updateTrustConfig('companyClients', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="individualClients">Number of individual clients</Label>
                    <Input
                      id="individualClients"
                      type="number"
                      min="0"
                      value={config.trustConfig.individualClients || 0}
                      onChange={(e) => updateTrustConfig('individualClients', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="showReviews"
                  checked={config.reviewsConfig.showReviews}
                  onCheckedChange={(checked) => updateReviewsConfig('showReviews', checked)}
                />
                <Label htmlFor="showReviews">Show reviews carousel</Label>
              </div>
              
              <p className="text-sm text-gray-500">
                Reviews are pulled automatically from your client interactions. 
                You cannot edit the review content, but you can choose whether to display them.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Models</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {config.pricingConfig.models.map((model, index) => (
                <Card key={model.id} className="mb-6">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Package {index + 1}</CardTitle>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => removePricingModel(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor={`title-${index}`}>Title</Label>
                      <Input
                        id={`title-${index}`}
                        value={model.title}
                        onChange={(e) => updatePricingModel(index, 'title', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`price-${index}`}>Price</Label>
                        <Input
                          id={`price-${index}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={model.price}
                          onChange={(e) => updatePricingModel(index, 'price', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`currency-${index}`}>Currency</Label>
                        <Input
                          id={`currency-${index}`}
                          value={model.currency}
                          onChange={(e) => updatePricingModel(index, 'currency', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor={`period-${index}`}>Period (e.g. "per hour", "per session")</Label>
                      <Input
                        id={`period-${index}`}
                        value={model.period || ''}
                        onChange={(e) => updatePricingModel(index, 'period', e.target.value)}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`highlighted-${index}`}
                        checked={model.isHighlighted || false}
                        onCheckedChange={(checked) => updatePricingModel(index, 'isHighlighted', checked)}
                      />
                      <Label htmlFor={`highlighted-${index}`}>Highlight this package (recommended)</Label>
                    </div>
                    
                    <div>
                      <Label className="block mb-2">Features</Label>
                      {model.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center mb-2">
                          <Input
                            value={feature}
                            onChange={(e) => updateFeatureInPricingModel(index, featureIndex, e.target.value)}
                            className="flex-grow"
                          />
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="ml-2"
                            onClick={() => removeFeatureFromPricingModel(index, featureIndex)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => addFeatureToPricingModel(index)}
                        className="mt-2"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Feature
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button onClick={addPricingModel} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Pricing Package
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {config.faqConfig.questions.map((item, index) => (
                <Card key={item.id} className="mb-4">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => removeFAQItem(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor={`question-${index}`}>Question</Label>
                      <Input
                        id={`question-${index}`}
                        value={item.question}
                        onChange={(e) => updateFAQItem(index, 'question', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`answer-${index}`}>Answer</Label>
                      <Textarea
                        id={`answer-${index}`}
                        value={item.answer}
                        onChange={(e) => updateFAQItem(index, 'answer', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button onClick={addFAQItem} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConsultantProfileEditor;
