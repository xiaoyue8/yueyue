from django.conf.urls.defaults import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'online.views.home', name='home'),
    # url(r'^online/', include('online.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
    url(r'^login/$','demo.views.login'),
    url(r'^index/$','demo.views.index'),
    url(r'^logout/$','demo.views.logout'),
    url(r'^demo/$','demo.views.demo'),
    url(r'^mayAndCatBus/$','demo.views.mayAndCatBus'),
    #url(r'^$','demo.views.login'),
    
    url(r'^$','demo.views.yueLogin'),
    url(r'^yue/login/$','demo.views.yueLogin'),    
    url(r'^yue/index/$','demo.views.yueIndex'),
    url(r'^yue/demo/$','demo.views.yueDemo'),
    url(r'^yue/mayAndCatBus/$','demo.views.yueMayAndCatBus'),
    
)

from django.contrib.staticfiles.urls import staticfiles_urlpatterns
urlpatterns += staticfiles_urlpatterns()